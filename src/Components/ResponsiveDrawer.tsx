import React, { useState } from "react"
import { Theme, makeStyles, createStyles, CssBaseline, AppBar, Toolbar, Hidden, Drawer, ToolbarProps, Grid } from "@material-ui/core"

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            'min-height': '100%',
            height: '100%',
            display: 'flex'
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 1
            }
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginRight: drawerWidth
            }
        },
        menuButton: {
            marginLeft: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            }
        },
        toolbar: {
            'max-height': '48px !important',
            height: '100%'
        },
        drawerPaper: {
            width: drawerWidth
        },
        fullWidth: {
            width: '100%'
        },
        fullHeight: {
            'min-height': '100%',
            height: '100%'
        },
        content: {
            height: '100%',
            flexGrow: 1
        },
        customWidth: {
            [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`
            }
        }
    })
)

interface ResponsiveDrawerProps {
    children: (mobileOpen: boolean, handleToggleMenu: () => void, drawerWidth: number) => React.ReactNodeArray
    toolbarProps?: ToolbarProps
}

export default function ResponsiveDrawer(props: ResponsiveDrawerProps) {
    const classes = useStyles()

    const toolbarProps = props.toolbarProps || {}
    const [mobileOpen, setMobileOpen] = useState(false)

    // EVENTS
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const [toolbar, drawerContent, content] = props.children(mobileOpen, handleDrawerToggle, drawerWidth)

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar {...toolbarProps}>
                    {toolbar}
                </Toolbar>
            </AppBar>
            <Grid container direction={'column'} justify={'flex-start'} spacing={0} className={classes.customWidth}>
                <Grid item className={classes.toolbar}></Grid>
                <Grid item xs className={classes.fullWidth}>
                    {content}
                </Grid>
            </Grid>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={'right'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        anchor={'right'}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawerContent}
                    </Drawer>
                </Hidden>
            </nav>
        </div>
    )
}