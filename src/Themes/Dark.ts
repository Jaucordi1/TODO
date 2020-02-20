import { makeStyles, Theme as AugmentedTheme, createStyles, createMuiTheme } from "@material-ui/core"
import { red } from '@material-ui/core/colors'

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        status: {
            danger: string
        }
    }

    interface ThemeOptions {
        status?: {
            danger?: string
        }
    }
}

// const drawerWidth = 240
const toolbarType = 'dense'
const toolbarHeight = toolbarType === 'dense' ? 48 : 60

export const useStyles = makeStyles((theme: AugmentedTheme) =>
  createStyles({
    root: {
      color: red[500],
      '&$checked': {
        color: red[900]
      }
    },
    'text-center': {
      'text-align': 'center !important'
    },
    center: {
      'margin-left': 'auto !important',
      'margin-right': 'auto !important',
    },
    fullWidth: {
      width: '100%'
    },
    fullHeight: {
      'min-height': '100%',
      height: '100%'
    },
    'h-80': {
      height: `calc(100% - 48px)`
    },
    toolbar: {
      'max-height': '48px !important',
      height: '100% !important'
    },
    p0: {
      padding: 0
    },
    bold: {
      'font-weight': 'bold'
    },
    pointer: {
      cursor: 'pointer'
    },
    menuButton: {
      marginLeft: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    fab: {
      [theme.breakpoints.up('sm')]: {
        'margin-right': theme.spacing(5)
      }
    },
    todoList: {
      'max-height': `calc(100% - ${toolbarHeight}px)`,
      height: '100%',
      'overflow-x': 'none',
      'overflow-y': 'auto'
    },
    checked: {}
  })
)

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

export default theme