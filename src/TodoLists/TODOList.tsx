import React, { useRef, useCallback, useState } from "react"
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Grid, List, ListItem, ListItemIcon, Checkbox, ListItemSecondaryAction, ListItemText, Typography, IconButton, Input, Box, Fab, FormControl } from "@material-ui/core"
import theme, { useStyles } from "../Themes/Dark"
import 'react-perfect-scrollbar/dist/css/styles.css'
import { Add as AddIcon, Check as CheckIcon, Edit as EditIcon, Close as CloseIcon, Block as CancelIcon } from '@material-ui/icons'

export interface ITODOItem {
    text: string
    finished: boolean
    createdAt: Date
    lastUpdated: Date | null
}
export interface ITODOList {
    name: string
    todos: ITODOItem[]
    autoDismiss: boolean
    createdAt: Date
    lastUpdated: Date | null
}
export interface TODOListProps {
    setup: ITODOList
    size?: 'small' | 'medium'
    onChange: (todos: ITODOItem[]) => void
}
export default function TODOList(props: TODOListProps) {
    const classes = useStyles()
    const newTODOInput = React.createRef<HTMLInputElement>()
    const [editedTODOIndex, setEditedTODOIndex] = useState(-1)
    let editInputBlurTimeout: NodeJS.Timeout | undefined

    const TODOEditInput = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
    const ref = useRef(null)
    const setRef = useCallback(node => {
        if (node !== null)
            scrollDown(node)

        ref.current = node
    }, [])

    const scrollDown = (container: HTMLElement, delay: number = 100) => {
        setTimeout(() => {
            container.scrollTo({
                top: 999999999999,
                behavior: 'smooth'
            })
        }, delay)
    }

    const onItemClick = (ev: React.MouseEvent, todoIndex: number) => {
        ev.preventDefault()
        if (editedTODOIndex === todoIndex) return
        const newTODOs = props.setup.todos.map((todo, idx) => idx === todoIndex ? { ...todo, finished: !todo.finished } : todo)
        if (!props.setup.autoDismiss)
            props.onChange(newTODOs)
        else
            props.onChange(newTODOs.filter(todo => !todo.finished))
    }
    /* const onItemCheck = (ev: React.MouseEvent, checked: boolean) => {
        ev.stopPropagation()
    } */
    const handleDeleteTODO = (ev: React.MouseEvent, todoIndex: number) => {
        ev.stopPropagation()
        props.onChange(props.setup.todos.filter((todo, idx) => idx !== todoIndex))
    }
    const handleAddTODO = (ev: React.FormEvent) => {
        ev.preventDefault()

        if (newTODOInput.current !== null) {
            if (newTODOInput.current.value === "") return
            props.onChange([...props.setup.todos, {
                text: newTODOInput.current.value,
                finished: false,
                createdAt: new Date(),
                lastUpdated: null
            }])
            if (ref.current !== null) scrollDown(ref.current!)
            newTODOInput.current.value = ''
            newTODOInput.current.focus()
        }
    }
    const handleEditTODO = (ev: React.MouseEvent, todoIndex: number) => {
        ev.preventDefault()
        if (editedTODOIndex > -1) console.info('Non-saved TODO text change !')
        setEditedTODOIndex(todoIndex)
    }
    const handleEditTODOConfirm = (ev: React.FormEvent | React.MouseEvent, todoIndex: number) => {
        ev.preventDefault()
        if (editInputBlurTimeout !== undefined) {
            clearTimeout(editInputBlurTimeout)
            editInputBlurTimeout = undefined
        }
        if (todoIndex !== editedTODOIndex) return console.error(`Edition confirmation for TODO #${todoIndex} but actually edited TODO is #${editedTODOIndex} !`)
        props.onChange(props.setup.todos.map((todo, idx) => idx === todoIndex ? { ...todo, text: TODOEditInput.current!.value } : todo))
        setEditedTODOIndex(-1)
    }
    const handleEditInputFocus = (ev: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        ev.target.select()
    }

    /* <Slide direction={'up'} in={props.setup.autoDismiss ? !todo.finished : true} mountOnEnter unmountOnExit></Slide> */

    return (
        <Box pt={1} className={classes.fullHeight} style={{ position: 'relative' }}>
            <Grid container direction={'column'} justify={'flex-start'} className={classes.fullHeight}>
                <Grid item xs className={classes.todoList}>
                    <PerfectScrollbar
                        options={{
                            suppressScrollX: true,
                            swipeEasing: true
                        }}
                        containerRef={setRef}
                    >
                        <List>
                            {
                                props.setup.todos.map((todo, idx) => (
                                    <ListItem key={idx} onClick={ev => onItemClick(ev, idx)} button>
                                        <ListItemIcon>
                                            <Checkbox size={props.size || 'small'} checked={todo.finished} />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {
                                                editedTODOIndex === idx
                                                    ? (
                                                        <form onSubmit={ev => handleEditTODOConfirm(ev, idx)}>
                                                            <FormControl style={{ width: 'calc(100% - (48px * 2) + 10px)' }}>
                                                                <Input
                                                                    inputRef={TODOEditInput}
                                                                    onFocus={handleEditInputFocus}
                                                                    onBlur={() => editInputBlurTimeout = setTimeout(() => setEditedTODOIndex(-1), 100)}
                                                                    defaultValue={todo.text}
                                                                    autoFocus
                                                                />
                                                            </FormControl>
                                                        </form>
                                                    )
                                                    : <Typography style={{ width: 'calc(100% - (48px * 2) + 10px)' }}>{todo.text}</Typography>
                                            }
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton onClick={ev => editedTODOIndex !== idx ? handleEditTODO(ev, idx) : handleEditTODOConfirm(ev, idx)}>
                                                {editedTODOIndex === idx ? <CheckIcon /> : <EditIcon />}
                                                <Typography variant={'srOnly'}>{editedTODOIndex > -1 ? 'Valider' : 'Modifier'}</Typography>
                                            </IconButton>
                                            <IconButton onClick={ev => editedTODOIndex === idx ? setEditedTODOIndex(-1) : handleDeleteTODO(ev, idx)}>
                                                {editedTODOIndex === idx ? <CancelIcon /> : <CloseIcon />}
                                                <Typography variant={'srOnly'}>Supprimer</Typography>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </PerfectScrollbar>
                </Grid>
                <Grid item>
                    <Box pl={2} pr={12} pb={3}>
                        <form action='' method='post' onSubmit={handleAddTODO}>
                            <Input inputRef={newTODOInput} fullWidth />
                        </form>
                    </Box>
                </Grid>
            </Grid>
            <Fab key={'addFab'} color="primary" aria-label="add" style={{ position: 'absolute', bottom: theme.spacing(2), right: theme.spacing(2) }} onClick={handleAddTODO}>
                <AddIcon />
            </Fab>
        </Box>
    )
}