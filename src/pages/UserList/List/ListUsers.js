import React from 'react'
import { List } from '@mui/material'
import isEmpty from 'lodash/isEmpty'
import styled from '@emotion/styled'
import UserItem from './UserItem'

const CustomList = styled(List)`
  max-height: 400px;
  overflow: auto;
`

const ListUsers = ({ users, removeUser }) => {
  if (users && !isEmpty(users))
    return (
      <CustomList>
        {users.map((u) => (
          <UserItem key={u.id} user={u} removeUser={removeUser} />
        ))}
      </CustomList>
    )
  else {
    return <p>Empty</p>
  }
}

export default ListUsers
