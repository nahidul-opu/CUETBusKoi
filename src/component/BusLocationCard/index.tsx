import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import { spacing, fontConfig, colorList } from '../../config';
import Icon from 'react-native-vector-icons/Entypo';

interface BusinfoProps {
    busInfo: { id: number; busName: string; location: any };
    time: number;
}

function getLastTime(busData: any, time: number) {
    var loc = busData.location;
    if (time != -1) {
        if (time == 0) return 'now';
        else return 'update ' + time + ' min ago';
    } else {
        for (let i = 0; i < loc.length; i++) {
            if (loc[i]['longitude'] != 0 && loc[i]['latitude'] != 0) {
                if (i == 0) return 'now';
                else return 'update ' + i + ' min ago';
            }
        }
    }
}

const BusLocationCard = ({
    busInfo,
    time,
    locationPress,
    allBus,
}: BusinfoProps) => {
    function getPlaceNameFromAPI(lat: number, lon: number) {
        var requestOptions = {
            method: 'GET',
        };
        fetch(
            'https://api.geoapify.com/v1/geocode/reverse?lat=' +
                lat +
                '&lon=' +
                lon +
                '&apiKey=64f418d0c9284a559d444979fa4435b4',
            requestOptions,
        )
            .then(response => response.json())
            .then(result => {
                setPlaceFound(true);
                var place = result['features'][0]['properties'];
                console.log(place['street'] + ', ' + place['name']);
                setPlaceName(place['street'] + ', ' + place['name']);
            })
            .catch(error => {
                setPlaceName('Unknown');
                setPlaceFound(true);
            });
    }

    function getPlaceName(busData: any, time: number) {
        if (placeFound) return;
        var loc = busData.location;
        if (time != -1) {
            //return loc['longitude'] + ' ' + loc['latitude'];
            if (loc[time]['longitude'] == 0 || loc[time]['latitude'] == 0)
                return;
            else {
                getPlaceNameFromAPI(
                    loc[time]['latitude'],
                    loc[time]['longitude'],
                );
                return;
            }
        } else {
            for (let i = 0; i < loc.length; i++) {
                if (loc[i]['longitude'] != 0 && loc[i]['latitude'] != 0) {
                    time = i;
                    getPlaceNameFromAPI(
                        loc[time]['latitude'],
                        loc[time]['longitude'],
                    );
                    return;
                }
            }
        }
    }

    const [placeFound, setPlaceFound] = useState<boolean>(false);
    const [placeName, setPlaceName] = useState<string>('Unknown');
    getPlaceName(busInfo, time);
    // console.log(busInfo);
    return (
        <View style={styles.continer}>
            <TouchableOpacity style={styles.containerText}>
                <Text style={styles.busNameTxt}>{busInfo.busName}</Text>
                <View style={styles.containerLoc}>
                    <Text style={styles.locationTxt}>
                        {placeFound ? placeName : 'Unknown'}
                    </Text>
                    {time == 0 ? (
                        <Text style={styles.updateTimeTxt}> now</Text>
                    ) : (
                        <Text style={styles.updateTimeTxt}>
                            {getLastTime(busInfo, time)}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.locationIconBox}
                onPress={() => {
                    locationPress(busInfo, allBus);
                }}
            >
                <Icon
                    name="location"
                    size={35}
                    color={colorList.primaryXsoft}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    continer: {
        flexDirection: 'row',
        marginLeft: spacing.lg,
        marginRight: spacing.lg,
        borderRadius: spacing.sm,
        padding: spacing.md,
        elevation: spacing.md,
        backgroundColor: colorList.primaryXsoft,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginVertical: 10,
    },
    containerText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flex: 1,
    },
    containerLoc: {
        flexDirection: 'column',
        marginRight: spacing.lg,
    },
    busNameTxt: {
        fontSize: fontConfig.lg,
        color: colorList.primary,
        marginRight: spacing.md,
        minWidth: '25%',
    },
    locationTxt: {
        fontSize: fontConfig.lg,
        color: colorList.primary,
    },
    updateTimeTxt: {
        fontSize: fontConfig.sm,
        color: colorList.darkSoft,
        textAlign: 'left',
    },
    locationIconBox: {
        alignSelf: 'center',
        borderWidth: 0.3,
        borderRadius: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colorList.primarySoft,
    },
});

export default BusLocationCard;
