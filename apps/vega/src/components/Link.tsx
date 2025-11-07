/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface LinkProps {
  linkText: string;
  onPress: Function;
  testID?: string;
}

export const Link = ({linkText, onPress, testID}: LinkProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.linkContainer, focused && styles.focusedContainer]}
        onPress={() => onPress()}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        testID={testID}>
        <View style={styles.linkTextContainer}>
          {focused ? (
            <Image source={require('../assets/focusedStar.png')} />
          ) : (
            <Image source={require('../assets/star.png')} />
          )}
          <Text style={styles.linkText}>{linkText}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    width: 420,
    paddingBottom: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },
  focusedContainer: {
    borderBottomWidth: 5,
    borderBottomColor: '#ff9900',
  },
  linkTextContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 200,
    width: 300,
  },
  linkText: {
    color: 'white',
    fontSize: 45,
    marginLeft: 30,
  },
});
