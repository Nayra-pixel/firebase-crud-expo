// src/components/TodoItem.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const TodoItem = ({ item, onToggle, onEdit, onDelete }) => {
return (
<View style={styles.container}>
<TouchableOpacity onPress={() => onToggle(item)} style={styles.left}>
<View style={[styles.checkbox, item.done && styles.checkboxOn]} />
<Text style={[styles.title, item.done && styles.titleDone]} numberOfLines={2}>
{item.title}
</Text>
</TouchableOpacity>


<View style={styles.actions}>
<TouchableOpacity onPress={() => onEdit(item)} style={styles.btn}>
<Text style={styles.btnText}>Editar</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => onDelete(item)} style={[styles.btn, styles.btnDanger]}>
<Text style={[styles.btnText, styles.btnTextDanger]}>Excluir</Text>
</TouchableOpacity>
</View>
</View>
);
};


const styles = StyleSheet.create({
container: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
padding: 12,
backgroundColor: '#fff',
borderRadius: 16,
marginBottom: 10,
shadowColor: '#000',
shadowOpacity: 0.05,
shadowOffset: { width: 0, height: 2 },
shadowRadius: 4,
elevation: 2,
},
left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
checkbox: {
width: 22,
height: 22,
borderRadius: 6,
borderWidth: 2,
borderColor: '#999',
marginRight: 10,
},
checkboxOn: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
title: { fontSize: 16, color: '#222', flexShrink: 1 },
titleDone: { textDecorationLine: 'line-through', color: '#999' },
actions: { flexDirection: 'row', gap: 6 },
btn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: '#f1f1f1', borderRadius: 10 },
btnDanger: { backgroundColor: '#fdecea' },
btnText: { fontSize: 14, color: '#333' },
btnTextDanger: { color: '#c0392b' },
});


export default TodoItem;