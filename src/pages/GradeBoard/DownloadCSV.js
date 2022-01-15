import { CSVLink } from 'react-csv'
import { styled } from '@mui/styles'
import { Button } from '@mui/material'
import isEmpty from 'lodash/isEmpty'

const ButtonMenuTable = styled(Button)({
  justifyContent: 'flex-start',
  color: '#000000',
})

const CustomCSVLink = styled(CSVLink)({
  textDecoration: 'none',
  color: '#000',
})

const DownloadCSV = (props) => {
  const { data, id: gradeId, filename } = props

  const exportData = data
    .filter((gradeUser) => !!gradeUser.studentId)
    .map((gradeUser) => {
      return {
        studentId: gradeUser.studentId,
        point: gradeUser[gradeId],
      }
    })

  if (isEmpty(exportData)) {
    exportData.push(['studentId', 'point'])
  }

  return (
    <ButtonMenuTable fullWidth>
      <CustomCSVLink data={exportData} filename={filename}>
        Download
      </CustomCSVLink>
    </ButtonMenuTable>
  )
}

export default DownloadCSV
