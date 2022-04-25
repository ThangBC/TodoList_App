import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../constraints/';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';

const UIModalDetail = props => {
  const {isModalVisible, backPress, infor, removeTodo, updateTodo} = props;
  return (
    <Modal
      onBackdropPress={backPress}
      isVisible={isModalVisible}
      animationType="slide">
      <View style={styles.modalView}>
        <View style={styles.iconView}>
          <Icon onPress={backPress} name="times" color="white" size={20} />
        </View>
        <Text style={styles.nameText}>{infor.name}</Text>
        <View style={styles.bottomView}>
          <TouchableOpacity
            onPress={() => {
              if (infor.isDone == '0') {
                updateTodo(true, infor.id);
              } else {
                updateTodo(false, infor.id);
              }
            }}
            style={styles.statusBtn}>
            <Text
              style={[
                styles.statusBtnText,
                {
                  color:
                    infor.isDone == '0' ? colors.primaryColor : 'limegreen',
                },
              ]}>
              {infor.isDone == '0' ? 'Chưa xong' : 'Đã xong'}
            </Text>
            <CheckBox
              disabled={true}
              value={infor.isDone == '0' ? false : true}
              tintColors={{true: 'limegreen', false: colors.primaryColor}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              removeTodo(infor.id);
            }}
            style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Xóa</Text>
            <Icon
              style={styles.deleteIcon}
              name="trash"
              color="red"
              size={17}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconView: {
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: colors.primaryColor,
  },
  nameText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'flex-start',
    margin: 20,
  },
  bottomView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statusBtn: {
    paddingHorizontal: 5,
    borderRadius: 5,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 20,
    flexDirection: 'row',
    marginEnd: 5,
  },
  statusBtnText: {
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  deleteBtn: {
    paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft: 5,
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 20,
    flexDirection: 'row',
  },
  deleteBtnText: {
    color: 'red',
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
  },
  deleteIcon: {marginEnd: 10},
});

export default UIModalDetail;
