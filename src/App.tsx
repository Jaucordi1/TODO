import React, { useState, useRef } from "react"
import useLocalStorage from 'react-use-localstorage'
import theme, { useStyles } from './Themes/Dark'
import { IS_MOBILE, IS_MOBILE_HARD } from "./Regex"
import TODOList, { ITODOList, ITODOItem } from "./TodoLists/TODOList"
import ResponsiveDrawer from "./Components/ResponsiveDrawer"
import ConfirmationIconButton from "./Components/ConfirmationIconButton"
import { CssBaseline, ThemeProvider, Container, Grid, Typography, IconButton, Icon, List, ListItem, ListItemIcon, ListItemText, Box, Fab, ListItemSecondaryAction, Divider, Slide, Dialog, AppBar, Toolbar, Button, WithMobileDialog, Switch, FormControlLabel, Input } from "@material-ui/core"
import { TransitionProps } from "@material-ui/core/transitions/transition"
import { Add as AddIcon, List as ListIcon, Settings as GearIcon, Check as CheckIcon, Close as CloseIcon, Menu as MenuIcon, MenuOpen as OpenMenuIcon } from '@material-ui/icons'

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
	return <Slide direction="left" ref={ref} {...props} />
})
const isMobileDevice = (): boolean => {
	return IS_MOBILE.test(navigator.userAgent) || IS_MOBILE_HARD.test(navigator.userAgent.substr(0, 4))
}

// APP
export default function App() {
	const classes = useStyles()

	// LOCAL SAVE
	const [savedTODOLists, saveTODOLists] = useLocalStorage('lists', JSON.stringify([]))
	const [savedListIndex, saveListIndex] = useLocalStorage('list', '-1')

	// LOCAL STATE
	const [actualListIndex, setListIndex] = useState<number>(parseInt(savedListIndex, 10))
	const [TODOLists, setTODOLists] = useState<ITODOList[]>(JSON.parse(savedTODOLists))
	const [configModalListIndex, setConfigModalListIndex] = useState(-1)
	const [listNameEditMode, setListNameEditMode] = useState(false)

	// RENDER VARS
	const actualList = TODOLists.length > 0 ? TODOLists[actualListIndex] : undefined
	const actuallyConfiguredList = configModalListIndex > -1 ? TODOLists[configModalListIndex] : undefined
	const listConfigModal = useRef<WithMobileDialog>(null)
	const todoListNameInput = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
	let editTODOListNameTimeout: NodeJS.Timeout | undefined

	// ACTIONS
	const viewTODOList = (listIndex: number) => {
		saveListIndex(listIndex.toString(10))
		setListIndex(listIndex)
	}
	const changeTODOLists = (newLists: ITODOList[]) => {
		saveTODOLists(JSON.stringify(newLists))
		setTODOLists(newLists)
	}

	// EVENTS
	const handleDrawerListItem = (ev: React.MouseEvent, listIndex: number) => {
		ev.preventDefault()
		viewTODOList(listIndex)
	}
	const handleOpenListConfigModal = (ev: React.MouseEvent, listIndex: number, drawerToggle?: () => void) => {
		ev.stopPropagation()
		setConfigModalListIndex(listIndex)
		if (drawerToggle)
			drawerToggle()
	}
	const handleCloseListConfigModal = (ev: React.MouseEvent) => {
		ev.preventDefault()
		setConfigModalListIndex(-1)
	}
	const handleDeleteTODOList = (ev: React.MouseEvent, listIndex: number) => {
		ev.preventDefault()
		if (actualList === undefined) return

		const newLists = TODOLists.filter((list, idx) => idx !== listIndex)
		changeTODOLists(newLists)
		if (configModalListIndex === listIndex) setConfigModalListIndex(-1)

		if (newLists.length === 0)
			return viewTODOList(-1)
		// Il reste des TODO listes !

		if (listIndex === actualListIndex)
			return viewTODOList(Math.max(-1, listIndex === TODOLists.length - 1 ? actualListIndex - 1 : actualListIndex))
		// La liste supprimée n'est pas la liste visionnée !

		if (listIndex < actualListIndex)
			return viewTODOList(newLists.findIndex(list => list.name === actualList.name))
		// La liste supprimée se trouve AVANT la liste visionnée !

		if (listIndex > actualListIndex)
			viewTODOList(actualListIndex)
		// La liste supprimée se trouve APRÈS la liste visionnée !
	}
	const handleCreateTODOList = (ev: React.MouseEvent) => {
		ev.preventDefault()

		let name: string | null = ""
		const idxFinder = (list: ITODOList) => list.name === name
		while (name === "" || TODOLists.findIndex(idxFinder) !== -1)
			name = prompt("Saisir un nom pour la nouvelle TODO Liste !", `Liste #${TODOLists.length + 1}`)

		if (name === null) return

		changeTODOLists([...TODOLists, {
			name,
			autoDismiss: false,
			todos: [],
			createdAt: new Date(),
			lastUpdated: null
		}])
		viewTODOList(TODOLists.length)
	}
	const handleTODOListChange = (todos: ITODOItem[]) => {
		changeTODOLists(TODOLists.map((list, idx) => idx === actualListIndex ? { ...list, todos, lastUpdated: new Date() } : list))
	}
	const handleAutoDismissChange = (ev: React.ChangeEvent, value: boolean) => {
		changeTODOLists(TODOLists.map((list, idx) => idx === configModalListIndex ? { ...list, autoDismiss: value, lastUpdated: new Date() } : list))
	}
	const handleEditTODOListName = (ev: React.MouseEvent, listIndex: number) => {
		ev.preventDefault()
		setListNameEditMode(true)
	}
	const handleConfirmListNameEdit = (ev: React.FormEvent, listIndex: number) => {
		ev.preventDefault()
		if (editTODOListNameTimeout !== undefined) {
			clearTimeout(editTODOListNameTimeout)
			editTODOListNameTimeout = undefined
		}
		if (todoListNameInput.current !== null)
			changeTODOLists(TODOLists.map((list, idx) => idx === listIndex ? { ...list, name: todoListNameInput.current!.value, lastUpdated: new Date() } : list))
		setListNameEditMode(false)
	}
	const handleTODOListNameInputFocus = (ev: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		ev.target.select()
	}

	// RENDER
	const renderDrawerContent = (mobileOpen: boolean, drawerToggle: () => void) => {
		return (
			<Grid container direction={'column'} className={classes.fullHeight} spacing={0} justify={'flex-start'}>
				<Grid item className={classes.toolbar}>
					<Grid container direction={'column'} className={classes.fullHeight} spacing={0} justify={'center'} alignContent={'center'}>
						<Grid item>
							<IconButton onClick={handleCreateTODOList} size={'small'}>
								<>
									<AddIcon />
									<Typography variant={'srOnly'}>Nouvelle TODO Liste</Typography>
								</>
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
				<Grid item component={Divider} />
				<Grid item>
					<List>
						{
							TODOLists.map((list, idx) => (
								<ListItem key={idx} button onClick={ev => handleDrawerListItem(ev, idx)} selected={idx === actualListIndex}>
									<ListItemIcon>
										<>
											<ListIcon />
											<Typography variant={'srOnly'}>Icône de liste</Typography>
										</>
									</ListItemIcon>
									<ListItemText primary={list.name} />
									<ListItemSecondaryAction>
										<IconButton onClick={ev => handleOpenListConfigModal(ev, idx, mobileOpen ? drawerToggle : undefined)} size={'small'}>
											<>
												<GearIcon />
												<Typography variant={'srOnly'}>Paramètres de la liste</Typography>
											</>
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							))
						}
					</List>
				</Grid>
			</Grid>
		)
	}

	return (
		<Container fixed={false} maxWidth={false} className={[classes.fullHeight, classes.p0].join(' ')}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ResponsiveDrawer toolbarProps={{ variant: 'dense' }}>{
					(mobileOpen, drawerToggle, drawerWidth) => [
						(
							<Grid container key={'toolbar'} alignItems={'center'} justify={'flex-end'}>
								{
									actualList !== undefined && (
										<Grid item xs>
											{
												listNameEditMode
													? (
														<form action="" method="post" onSubmit={ev => handleConfirmListNameEdit(ev, actualListIndex)}>
															<Input id={'todo-list-edit'} defaultValue={actualList.name} inputRef={todoListNameInput} onFocus={handleTODOListNameInputFocus} onBlur={() => {
																editTODOListNameTimeout = setTimeout(() => setListNameEditMode(false), 100)
															}} autoFocus />
															<IconButton onClick={ev => handleConfirmListNameEdit(ev, actualListIndex)}>
																<CheckIcon />
																<Typography variant={'srOnly'}>Valider</Typography>
															</IconButton>
														</form>
													)
													: <Button variant={'text'} onClick={ev => handleEditTODOListName(ev, actualListIndex)}>{actualList.name}</Button>
											}
										</Grid>
									)
								}
								<Grid item>
									<Typography variant="h6" noWrap>TODO Liste</Typography>
								</Grid>
								<Grid item>
									<IconButton
										color="inherit"
										aria-label="open drawer"
										edge="start"
										onClick={drawerToggle}
										className={classes.menuButton}>
										<Icon>{mobileOpen ? <OpenMenuIcon /> : <MenuIcon />}</Icon>
									</IconButton>
								</Grid>
							</Grid>
						),
						renderDrawerContent(mobileOpen, drawerToggle),
						(
							actualList !== undefined
								? (
									<Grid container direction={'column'} justify={'flex-start'} className={classes.fullHeight} spacing={0}>
										<Grid item xs>
											<Dialog fullScreen TransitionComponent={Transition} open={configModalListIndex > -1} ref={listConfigModal} disablePortal>
												<AppBar className={classes.toolbar}>
													<Toolbar variant={'dense'}>
														<IconButton size={'small'} edge={'start'} onClick={ev => {
															handleCloseListConfigModal(ev)
															if (isMobileDevice() && !mobileOpen)
																drawerToggle()
														}}>
															<CloseIcon />
														</IconButton>
														<Typography variant={'h6'} style={{ flex: 1, marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }} noWrap>{actuallyConfiguredList && actuallyConfiguredList.name} - Paramètres</Typography>
														<ConfirmationIconButton buttonProps={{ size: 'small', color: 'secondary', variant: 'outlined' }} icon={<CloseIcon />} onConfirm={ev => handleDeleteTODOList(ev, configModalListIndex)}>Supprimer</ConfirmationIconButton>
													</Toolbar>
												</AppBar>
												<div className={classes.toolbar} />
												<List>
													<ListItem>
														<FormControlLabel
															control={<Switch checked={actuallyConfiguredList?.autoDismiss} onChange={handleAutoDismissChange} />}
															label={<Typography>Supprime une TODO au lieu de la marquer comme terminée</Typography>}
															labelPlacement={'start'} />
													</ListItem>
												</List>
											</Dialog>
											<TODOList key={'list'} setup={actualList} onChange={handleTODOListChange} />
										</Grid>
									</Grid>
								)
								: (
									<Grid container direction={'column'} justify={'center'} className={classes.fullHeight}>
										<Grid item>
											<Box textAlign={'center'}>
												<Typography key={'nolist'} variant={'subtitle2'} align={'center'}>Aucune TODO Liste !</Typography>
												<br />
												<Fab color={'primary'} onClick={handleCreateTODOList}>
													<AddIcon />
												</Fab>
											</Box>
										</Grid>
									</Grid>
								)
						)
					]
				}</ResponsiveDrawer>
			</ThemeProvider>
		</Container>
	)
}