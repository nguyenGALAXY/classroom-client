import { Avatar, Box, Typography } from '@mui/material'
import { NoDataIll } from 'src/_mocks_/Illustrations'
const NoDataDisplay = (props) => {
  return (
    <Box
      sx={{
        marginTop: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar
        src={!props.photoURL ? NoDataIll.photoURL : props.photoURL}
        alt={!props.displayName ? NoDataIll.displayName : props.displayName}
        sx={{ width: 320, height: 320 }}
      />
      <Typography variant="h6">No Data to show</Typography>
      <Typography variant="subtitle2">{props.msgSuggest}</Typography>
    </Box>
  )
}

export default NoDataDisplay
