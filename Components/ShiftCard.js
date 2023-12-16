
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const ShiftCard = ({ shift, style }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const handlePress = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
        }

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
        <Text style={styles.dateText}>Date: {shift.day} of {shift.month} ({shift.weekday})</Text>
        <Text style={styles.timeText}>Start Time: {shift.startTime} - End Time: {shift.endTime ? shift.endTime : '-'}</Text>
        <Text style={styles.timeText}>Total Breaks: {shift.breaksTotal ? `${shift.breaksTotal} minutes` : '-'}</Text>
        {shift.description && (
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.infoText}>
            Info: {description} {fitsOnOneLine ? '' : isDescriptionExpanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
    );
  };

  // <Text>Description: {shift.description ? shift.description : 'No description'}</Text>
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: screenWidth * 0.775,
  },
  dateText: {
    fontSize: screenWidth * 0.05,
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    borderBottom: 1,
    borderBottomColor: '#AEA8A4',
    borderBottomWidth: 2,
    textAlign: 'center',
  }, timeText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.037,
}, infoText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: screenWidth * 0.036,
    textAlign: 'left',
  },
});

export default ShiftCard;