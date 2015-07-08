const React = require('react-native');

const {
  MapView,
  StyleSheet,
  Text,
  TextInput,
  View,
  LinkingIOS
} = React;

const Shelters = require('./data/shelters');

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1,
    margin: 0
  }
});

export default React.createClass({

  getInitialState() {
    return {
      mapRegion: {
        longitudeDelta: 0.02540975064701456,
        latitude: 46.58100242725255,
        longitude: 0.3407858798158525,
        latitudeDelta: 0.02785060205418688
      },
      mapRegionInput: null,
      isFirstLoad: true,
      shelters: []
    };
  },

  componentDidMount() {
    Shelters.fetch().then((data) => {
      this.setState({
        shelters: data || []
      });
    });
  },

  render() {
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          mapType="hybrid"
          pitchEnabled={true}
          zoomEnabled={true}
          showsUserLocation={true}
          region={this.state.mapRegion}
          annotations={this._getAnnotations()}
        />
      </View>
    );
  },

  _getAnnotations() {
    return this.state.shelters.map(shelter => {
      return {
        id: shelter.objectId,
        animateDrop: true,
        latitude: shelter.location[1],
        longitude: shelter.location[0],
        title: shelter.address.replace(', 86000 Poitiers, France', ''),
        subtitle: `${shelter.type} pour ${shelter.capacity}`,
        hasRightCallout: true,
        onRightCalloutPress: () => {
          // will be supported in version > 0.6.0
          LinkingIOS.openURL(`http://maps.apple.com/?daddr=${shelter.location[1]},${shelter.location[0]}`);
        }
      }
    });
  },

  //_onRegionChange(region) {
  //  this.setState({
  //    mapRegionInput: region,
  //  });
  //},
//
  //_onRegionChangeComplete(region) {
  //  if (this.state.isFirstLoad) {
  //    this.setState({
  //      mapRegionInput: region,
  //      isFirstLoad: false,
  //    });
  //  }
  //},
});
