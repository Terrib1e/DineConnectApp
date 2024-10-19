import React, {useState} from 'react';
import {View, Button, Text, Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({onDateChange}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onDateChange(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
      <Button onPress={showDatepicker} title="Select Date" />
      <Text style={styles.dateText}>
        Selected Date: {date.toLocaleDateString()}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default DatePicker;
