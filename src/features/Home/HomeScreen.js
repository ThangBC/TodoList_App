import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {colors} from '../../constraints/';
import {openDatabase} from 'react-native-sqlite-storage';
import {UIModalDetail} from '../../components/';
import moment from 'moment';
import 'moment/locale/vi';
import {Keyboard} from 'react-native';

const db = openDatabase({
  name: 'todolist_manager',
});

const HomeScreen = props => {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [countDone, setCountDone] = useState(0);
  const [countNotDone, setCountNotDone] = useState(0);
  // const [reference, setReference] = useState(null);
  // const [cancelScroll, setCancelScroll] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [infor, setInfor] = useState({});

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS todolist (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, isDone TEXT,createdAt TEXT)`,
        [],
        (sql, res) => {
          console.log('table created successfully');
        },
        error => {
          console.log('error creating table');
        },
      );
    });
  };

  const getListTodo = () => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM todolist ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log('get successfully');
          let len = res.rows.length;
          let result = [];
          let countDone = 0;
          let countNotDone = 0;
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              result.push({
                id: item.id,
                name: item.name,
                isDone: item.isDone,
                createdAt: item.createdAt,
              });
              if (item.isDone == '1') {
                countDone++;
              } else {
                countNotDone++;
              }
            }
          }
          setCountDone(countDone);
          setCountNotDone(countNotDone);
          setTodoList(result);
          setIsModalVisible(false);
        },
        error => {
          console.log('error getting');
        },
      );
    });
  };

  const addTodo = () => {
    const currentDate = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    if (!todo) {
      alert('Hãy nhập việc cần làm');
      return false;
    }
    db.transaction(txn => {
      txn.executeSql(
        `INSERT INTO todolist (name,isDone,createdAt) VALUES (?,?,?)`,
        [todo, '0', currentDate],
        (sqlTxn, res) => {
          console.log('add successfully');
          Keyboard.dismiss();
          getListTodo();
          setTodo('');
        },
        error => {
          console.log('error adding' + error.message);
        },
      );
    });
  };

  const removeTodo = id => {
    db.transaction(txn => {
      txn.executeSql(
        `DELETE FROM todolist WHERE id = ?`,
        [id],
        (sqlTxn, res) => {
          console.log('delete successfully');

          getListTodo();
        },
        error => {
          console.log('error delete');
        },
      );
    });
  };

  const updateIsDone = (newValue, id) => {
    db.transaction(txn => {
      txn.executeSql(
        `UPDATE todolist SET isDone = ? WHERE id = ?`,
        [newValue ? '1' : '0', id],
        (sqlTxn, res) => {
          console.log('update successfully');
          getListTodo();
        },
        error => {
          console.log('error update');
        },
      );
    });
  };

  const formatDate = date => {
    return moment(date, 'DD-MM-YYYY HH:mm:ss').startOf('seconds').fromNow();
  };

  useEffect(() => {
    async function fetchData() {
      await createTable();
      await getListTodo();
    }
    fetchData();
  }, []);

  useEffect(() => {
    setInterval(async () => {
      await getListTodo();
    }, 1000 * 60);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerTitle}>To-Do List</Text>
      </View>
      <View style={styles.countView}>
        <Text style={styles.doneText} numberOfLines={1}>
          {countDone} việc đã hoàn thành
        </Text>
        <Text numberOfLines={1} style={styles.notDoneText}>
          {countNotDone} việc cần làm
        </Text>
      </View>
      <FlatList
        // ref={ref => {
        //   console.log('hihi');
        //   if (cancelScroll == false) {
        //     setReference(ref);
        //   }
        // }}
        // onContentSizeChange={() => {
        //   if (reference != null) {
        //     reference.scrollToOffset({animated: true, offset: 0});
        //     reference.scrollToEnd({animated: true})
        //   }
        // }}
        // onLayout={() => {
        //   if (reference != null) {
        //     reference.scrollToOffset({animated: true, offset: 0});
        //     reference.scrollToEnd({animated: true})
        //   }
        // }}
        data={todoList}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => {
          return (
            <View style={styles.itemView}>
              <TouchableOpacity
                onPress={() => alert('Giữ để hiển thị chi tiết')}
                onLongPress={() => {
                  setIsModalVisible(true);
                  setInfor({
                    id: item.id,
                    name: item.name,
                    isDone: item.isDone,
                  });
                }}
                delayLongPress={500}
                style={styles.holdBtn}>
                <Icon
                  style={styles.statusIcon}
                  size={18}
                  name={item.isDone == '0' ? 'spinner' : 'check'}
                  color={item.isDone == '0' ? colors.primaryColor : 'limegreen'}
                />

                <Text style={styles.todoName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.dateView}>
                  <Text style={styles.dateText}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
              {item.isDone == '0' ? <View /> : <View style={styles.line} />}
            </View>
          );
        }}
      />

      <View style={styles.bottomView}>
        <View style={styles.inputView}>
          <TextInput
            value={todo}
            placeholder={'Nhập việc cần làm'}
            placeholderTextColor={'gray'}
            style={styles.input}
            onChangeText={text => {
              setTodo(text);
            }}
          />
        </View>
        <TouchableOpacity onPress={addTodo} style={styles.submitBtn}>
          <Icon name="plus" color="white" size={17} />
        </TouchableOpacity>
      </View>
      <UIModalDetail
        removeTodo={id => {
          removeTodo(id);
          // setCancelScroll(true);
        }}
        updateTodo={(newValue, id) => {
          updateIsDone(newValue, id);
        }}
        isModalVisible={isModalVisible}
        infor={infor}
        backPress={() => {
          setIsModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerView: {
    height: 70,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    marginBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    marginLeft: 10,
  },
  countView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  doneText: {color: 'green', flex: 0.5, textAlign: 'left', fontSize: 15},
  notDoneText: {
    flex: 0.5,
    color: colors.primaryColor,
    textAlign: 'right',
    fontSize: 15,
  },
  itemView: {
    elevation: 10,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: index + 1 == todoList.length ? 100 : null,
    borderRadius: 10,
  },
  holdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusIcon: {
    flex: 0.1,
    textAlign: 'center',
  },
  todoName: {
    color: 'black',
    fontSize: 20,
    flex: 0.6,
  },
  dateView: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dateText: {
    color: 'gray',
    marginRight: 10,
  },
  line: {
    height: 2,
    width: '90%',
    backgroundColor: 'black',
    position: 'absolute',
    top: '50%',
    alignSelf: 'flex-end',
  },
  bottomView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
  },
  inputView: {
    marginVertical: 20,
    elevation: 40,
    backgroundColor: 'white',
    height: 50,
    borderRadius: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flex: 1,
  },
  input: {fontSize: 20, color: 'black'},
  submitBtn: {
    marginVertical: 20,
    backgroundColor: colors.primaryColor,
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default HomeScreen;
