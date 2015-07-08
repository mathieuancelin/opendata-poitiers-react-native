const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ActivityIndicatorIOS
} = React;

const ShelterList = require('./list');
const About = require('./about');
const Map = require('./map');
const NearMe = require('./nearme');
const Shelters = require('./data/shelters');

const opendatapoitiers = React.createClass({
  getInitialState() {
    return {
      loaded: false,
      error: false,
      selectedTab: 'map'
    };
  },
  tryToPrefetch() {
    this.setState({ error: false });
    Shelters.fetch().then((data) => {
      this.setState({
        loaded: true
      });
    }).catch(() => {
      this.setState({
        error: true
      });
    });
  },
  componentDidMount() {
    if (!this.state.loaded) {
      this.tryToPrefetch();
    }
  },
  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Error while loading bike shelters :(
          </Text>
          <View onPress={this.tryToPrefetch} style={{ borderColor: 'black', borderRadius: 4, borderStyle: 'solid', borderWidth: 1, padding: 15, marginTop: 20 }}>
            <Text onPress={this.tryToPrefetch}>Retry now</Text>
          </View>
        </View>
      );
    }
    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Loading bike shelters ...
          </Text>
          <ActivityIndicatorIOS
            animating={true}
            style={{alignItems: 'center', justifyContent: 'center', height: 80}}
            size="large"
          />
        </View>
      );
    }
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="black">
        <TabBarIOS.Item
          icon={require('image!map-8')}
          title="Map"
          selected={this.state.selectedTab === 'map'}
          onPress={() => { this.setState({ selectedTab: 'map' }); }}>
            <Map />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Near me"
          icon={require('image!search-256')}
          selected={this.state.selectedTab === 'nexttome'}
          onPress={() => { this.setState({ selectedTab: 'nexttome' }); }}>
            <NearMe />
        </TabBarIOS.Item>
        <TabBarIOS.Item
        title="All"
          icon={require('image!list')}
          selected={this.state.selectedTab === 'list'}
          onPress={() => { this.setState({ selectedTab: 'list' }); }}>
            <ShelterList />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="more"
          selected={this.state.selectedTab === 'about'}
          onPress={() => { this.setState({ selectedTab: 'about' }); }}>
            <About />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('opendatapoitiers', () => opendatapoitiers);
