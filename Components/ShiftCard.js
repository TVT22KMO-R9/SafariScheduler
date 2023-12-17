
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const ShiftCard = ({ shift, style }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handlePress = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
        }

        const getOrdinalSuffix = (day) => {
            if (day % 10 === 1 && day !== 11) {
              return `${day}st`;
            } else if (day % 10 === 2 && day !== 12) {
              return `${day}nd`;
            } else if (day % 10 === 3 && day !== 13) {
              return `${day}rd`;
            } else {
              return `${day}th`;
            }
          };

        const dayWithSuffix= getOrdinalSuffix(shift.day);

    const screenWidth = Dimensions.get('window').width;
    const cleanedDescription = shift.description.replace(/\n/g, ' ');
    const estimatedCharWidth = screenWidth * 0.036;
    const charsPerLine = Math.floor(screenWidth / estimatedCharWidth);

    const fitsOnOneLine = cleanedDescription.length <= charsPerLine;

    const description = isDescriptionExpanded || fitsOnOneLine
    ? cleanedDescription
    : `${cleanedDescription.substring(0, charsPerLine)}...`;


    return (
      <View style={[styles.card, style]}>
        <View style={styles.dateContainer}>
            <Text style={styles.dateNum}>{shift.day}</Text>
            <Text style={styles.dateText}>{shift.weekday}</Text>
        </View>
        <View style={styles.startEndContainer}>
            <Text style={styles.startEndText}>{shift.startTime} - {shift.endTime ? shift.endTime : ' '}</Text>
            <Text style={styles.timeText}>Breaks: {shift.breaksTotal ? `${shift.breaksTotal} minutes` : '-'}</Text>
        
            {shift.description && (
            <TouchableOpacity onPress={handlePress}>
                 <Text style={styles.infoText}>
                 Info: {description} {fitsOnOneLine ? '' : isDescriptionExpanded ? '▲' : '▼'}
                 </Text>
            </TouchableOpacity>
)}
      </View>
    </View>
    );
  };

  // <Text>Description: {shift.description ? shift.description : 'No description'}</Text>
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 0,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'white',
    width: screenWidth * 0.8,
    height: screenHeight * 0.15,
    flex:1,
  },dateNum: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.155,

  },startEndContainer:{
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  dateText: {
    fontSize: screenWidth * 0.05,
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    
    
  }, timeText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.03,
    
},
    startEndText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.06,
    textAlign: 'center',

    },
 infoText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.03,
  }, dateContainer: {
    flex: 0.3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRightWidth: 2,
    borderColor: 'white',
  }
});

export default ShiftCard;