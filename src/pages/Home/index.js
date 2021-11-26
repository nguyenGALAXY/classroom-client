import { Grid } from '@mui/material'
import ClassroomCard from './ClassroomCard/ClassroomCard'
import Layout from 'src/Layout/Layout'
import { useSelector } from 'react-redux'
import LoadingPage from 'src/components/LoadingPage'
const Home = () => {
  const classrooms = useSelector((state) => state.classrooms.classrooms)
  const isLoading = useSelector((state) => state.classrooms.isLoading)
  return (
    <div>
      <Layout>
        {isLoading ? (
          LoadingPage()
        ) : (
          <Grid container sx={{ alignItems: 'center' }}>
            {classrooms.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </Grid>
        )}
      </Layout>
    </div>
  )
}

export default Home
