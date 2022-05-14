/**
 * 参考ソース
 * https://mui.com/material-ui/react-app-bar/#PrimarySearchAppBar.tsx
 */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';

export default function PrimarySearchAppBar() {

    return (
        <Box>
            <AppBar position="static" enableColorOnDark>
                <Toolbar>
                    {/* ハンバーガ */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* ロゴ */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'block', sm: 'block' } }}
                    >
                        🐕(´・ω・｀)🐈
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        {/* 検索 */}
                        <IconButton size="large" aria-label="find" color="inherit">
                            <SearchIcon />
                        </IconButton>

                        {/* 履歴 */}
                        <IconButton size="large" aria-label="history" color="inherit">
                            <Badge badgeContent={17} color="error">
                                <HistoryIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}