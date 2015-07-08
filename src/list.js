const React = require('react-native');
const _ = require('lodash');

const {
  AppRegistry,
  StyleSheet,
  MapView,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  NavigatorIOS,
  TextInput
} = React;

const Shelters = require('./data/shelters');

const styles = StyleSheet.create({
  stack: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  text: {
    flex: 1,
    marginLeft: 10
  },
  textSmall: {
    marginTop: 20,
    flex: 1,
    fontSize: 10,
    fontWeight: 'normal'
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15
  }
});

const source = require('image!bicycle.png');

const mapStyles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1,
    margin: 0
  }
});

const ShelterMap = React.createClass({

  getInitialState() {
    return {
      mapRegion: {
        latitude: this.props.latitude,
        longitude: this.props.longitude,
        longitudeDelta: 0.02540975064701456,
        latitudeDelta: 0.02785060205418688
      },
      annotations: [
        {
          id: "1",
          title: this.props.title,
          subtitle: this.props.subTitle,
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          animateDrop: true,
          hasRightCallout: true,
          onRightCalloutPress: () => {
            // will be supported in version > 0.6.0
            LinkingIOS.openURL(`http://maps.apple.com/?daddr=${this.props.latitude},${this.props.longitude}`);
          }
        }
      ]
    };
  },

  render() {
    return (
      <View style={mapStyles.mapContainer}>
        <MapView
          style={mapStyles.map}
          mapType="hybrid"
          pitchEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          region={this.state.mapRegion}
          annotations={this.state.annotations}
        />
      </View>
    );
  }
});

const ShelterList = React.createClass({
  getInitialState() {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.objectId !== r2.objectId });
    return {
      data: ds.cloneWithRows([]),
      input: ''
    };
  },
  componentDidMount() {
    Shelters.fetch().then(data => {
      let filteredData = data.filter(i => !_.isNull(i.address));
      this.setState({
        rawData: filteredData,
        data: this.state.data.cloneWithRows([{objectId: "inputsearch"}].concat(filteredData))
      })
    });
  },
  _pressRow(item) {
    this.props.navigator.push({
      title: "",
      component: ShelterMap,
      passProps: {
        longitude: item.location[0],
        title: `${item.address}`,
        subTitle: `${item.type} pour ${item.capacity}`,
        latitude: item.location[1]
      }
    });
  },
  inputChange(text) {
    let newData = this.state.rawData.filter(item => item.address.toLowerCase().indexOf(text.toLowerCase()) > -1);
    console.log(newData.length);
    this.setState({
      input: text,
      data: this.state.data.cloneWithRows([{objectId: "inputsearch"}].concat(newData))
    });
  },
  renderRow(item) {
    if (item.objectId === 'inputsearch') {
      return (
        <View style={styles.row}>
          <TextInput onChangeText={this.inputChange} placeholder="Place de la liberté" clearButtonMode="always" keyboardType="default" style={styles.searchInput} />
        </View>
      );
    }
    return (
      <TouchableHighlight onPress={() => this._pressRow(item)}>
        <View>
          <View style={styles.row}>
            <Image style={styles.thumb} source={source} />
            <Text style={styles.text} numberOfLines={3}>
              {item.address}
              {'\n\n'}
              <Text style={{ fontSize: 10 }}>{item.type} pour {item.capacity} vélos</Text>
            </Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );

  },
  render() {
    return (
      <ListView
        dataSource={this.state.data}
        renderRow={this.renderRow}
      />
    );
  }
});

export default React.createClass({
  render() {
    return (
      <NavigatorIOS
        style={{flex: 1, backgroundColor: '#F6F6EF'}}
        tintColor = 'black'
        initialRoute = {{
          title: 'Select a shelter',
          component: ShelterList,
        }} />
    );
  }
});
