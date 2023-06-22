import WiFiReborn from 'react-native-wifi-reborn';

WiFiReborn.connectSecure({
    ssid: 'yourSSID',
    password: 'yourPassword',
    isWep: false, // for WEP network, isWep: true
}).then(() => {
    console.log('connectSecure success!');
})
    .catch((error) => {
        console.log('connectSecure error: ', error.message);
    });
