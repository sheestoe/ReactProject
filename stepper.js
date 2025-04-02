import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Checkbox from 'expo-checkbox';
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import NumericInput from './input-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const Stepper = () => {
  const totalNumbers = 25;
  const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  const [toRemove, setToRemove] = useState([]);
  const [toKeep, setToKeep] = useState([]);
  const [checkedStateRemove, setCheckedStateRemove] = useState(new Array(totalNumbers).fill(false));
  const [checkedStateKeep, setCheckedStateKeep] = useState(new Array(totalNumbers).fill(false));
  const [numberToGenerate, setNumberToGenerate] = useState(numbers.length);
  const navigation = useNavigation();

  const handleOnChangeRemove = (position) => {
    if (toKeep.includes(numbers[position])) {
      Alert.alert('Número garantido', 'Número ' + numbers[position] + " já foi selecionado para ser garantido.", [
        { text: 'OK', onPress: () => { } },
      ]);
    } else {
      const updatedCheckedState = checkedStateRemove.map((item, index) =>
        index === position ? !item : item
      );
      setCheckedStateRemove(updatedCheckedState);

      const newNumbers = numbers.filter((_, index) => updatedCheckedState[index]);
      setToRemove(newNumbers);
    }
  };

  const handleOnChangeKeep = (position) => {
    if (toRemove.includes(numbers[position])) {
      Alert.alert('Número eliminado', 'Número ' + numbers[position] + " já foi selecionado para ser eliminado.", [
        { text: 'OK', onPress: () => { } },
      ]);
    } else {
      const updatedCheckedStateKeep = checkedStateKeep.map((item, index) =>
        index === position ? !item : item
      );
      setCheckedStateKeep(updatedCheckedStateKeep);

      const newNumbers = numbers.filter((_, index) => updatedCheckedStateKeep[index]);
      setToKeep(newNumbers);
    }
  };

  const progressStepsStyle = {
    activeStepIconBorderColor: "lightblue",
    activeLabelColor: "black",
    activeStepNumColor: "black",
    activeStepIconColor: "lightblue",
    completedStepIconColor: "lightgreen",
    completedProgressBarColor: "lightgreen",
    completedCheckColor: "green",
  };

  const buttonTextStyle = {
    color: "#686868",
    fontWeight: "bold",
  };

  const onNextStepCount = () => {
    setNumberToGenerate(numbers.length - toRemove.length)
  };

  const defaultScrollViewProps = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
      flex: 1,
      justifyContent: "center",
    },
  };

  function combinations(array, maxSize, toKeep) {
    const result = [];
    const currentCombination = [];

    function generateCombinations(start, currentSize) {
      if (currentSize === 0) {
        currentCombination
        result.push([...currentCombination.concat(toKeep).map((n) => (`${n}`.padStart(2, '0'))).sort()]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        currentCombination.push(array[i]);
        generateCombinations(i + 1, currentSize - 1);
        currentCombination.pop();
      }
    }

    generateCombinations(0, maxSize);
    return result;
  }

  const onNextSubmit = () => {
    maxNumbers = numberToGenerate - toKeep.length
    inputArray = numbers.filter(function (el) {
      return !toRemove.includes(el) && !toKeep.includes(el);
    });

    const resultCombinations = combinations(inputArray, maxNumbers, toKeep);

    _storeData = async () => {
      try {
        await AsyncStorage.setItem(
          'lastResult',
          JSON.stringify(resultCombinations),
        );
        alert("salvo com sucesso!")
        navigation.navigate('Histórico')
      } catch (error) {
        alert(error)
      }
    };
    _storeData()
  };
  const test = () => {
    console.log("test")
  }

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <ProgressSteps {...progressStepsStyle}>
        <ProgressStep
          label="Eliminar"
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1, alignContent: 'stretch' }}>
              {numbers.map((number, index) => (
                <View key={index} style={{ flexDirection: 'row', flexBasis: '20%', transform: 'scale(1.2)', alignItems: 'center', justifyContent: "center" }}>
                  <Checkbox
                    value={checkedStateRemove[index]}
                    onValueChange={() => handleOnChangeRemove(index)}
                  />
                  <Text> {`${number}`.padStart(2, '0')}</Text>
                </View>
              ))}
            </View>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Garantir"
          onNext={onNextStepCount}
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flexGrow: 1, alignContent: 'stretch' }}>
              {numbers.map((number, index) => (
                <View key={index} style={{ flexDirection: 'row', flexBasis: '20%', transform: 'scale(1.2)', alignItems: 'center', justifyContent: "center" }}>
                  <Checkbox
                    value={checkedStateKeep[index]}
                    onValueChange={() => handleOnChangeKeep(index)}
                  />
                  <Text> {`${number}`.padStart(2, '0')}</Text>
                </View>
              ))}
            </View>
          </View>
        </ProgressStep>
        <ProgressStep
          label="Número de dezenas"
          onSubmit={onNextSubmit}
          scrollViewProps={defaultScrollViewProps}
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={buttonTextStyle}
        >
          <View style={{ flexGrow: 1 }}>
            <View style={{ flexDirection: 'column', flexWrap: 'wrap', flexGrow: 1, alignContent: 'center', justifyContent: 'center' }}>
              <NumericInput value={numberToGenerate} onChange={setNumberToGenerate} minValue={toKeep.length + 1} maxValue={numbers.length - toRemove.length} fontSize="200px" />
            </View>
          </View>
        </ProgressStep>
      </ProgressSteps>
    </View >
  );
};



export default Stepper;
