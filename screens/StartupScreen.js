import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'

import * as authActions from '../store/actions/auth'
import * as userRealtimeActions from '../store/actions/users'
/* import Loading from '../components/UI/Loading' */

const StartupScreen = (props) => {
	/* const [isLoading, setIsLoading] = useState() */
	const dispatch = useDispatch()

	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem('userData')
			if (!userData) {
				props.navigation.navigate('Welcome')
				return
			}
			const transformedData = JSON.parse(userData)
			const { token, userId, expiryDate } = transformedData
			const expirationDate = new Date(expiryDate)

			if (expirationDate <= new Date() || !token || !userId) {
				dispatch(authActions.logout())
				props.navigation.navigate('AdminNavigator')
				return
			}
			const expirationTime = expirationDate.getTime() - new Date().getTime()

			await dispatch(authActions.authenticate(userId, token, expirationTime))
			await dispatch(userRealtimeActions.fetchUserData())
			props.navigation.navigate('ProductsNavigator')
		}

		tryLogin()
	}, [dispatch])

	/* if (isLoading) {
		return <Loading />
	} */

	return (
		<View style={styles.screen}>
			<Text>Welcome Screen</Text>
			<Button
				title='Перейти в магазин'
				onPress={() => {
					props.navigation.navigate('ProductsNavigator')
				}}
			/>
			<Button
				title='Авторизоваться'
				onPress={() => {
					props.navigation.navigate('AdminNavigator')
				}}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default StartupScreen
