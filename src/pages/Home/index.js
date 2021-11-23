import { Grid } from '@mui/material'
import ClassroomCard from './ClassroomCard/ClassroomCard'
import Layout from 'src/Layout/Layout'
import { useSelector } from 'react-redux'
const Home = () => {
  const classrooms = useSelector((state) => state.classrooms.classrooms)
  return (
    <div>
      <Layout>
        <Grid container sx={{ alignItems: 'center' }}>
          {classrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </Grid>
      </Layout>
    </div>
  )
}

export default Home
