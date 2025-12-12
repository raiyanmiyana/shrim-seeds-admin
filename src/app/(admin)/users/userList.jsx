import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'
import ReactTable from '@/components/Table'
import { get } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/loader'

const sizePerPageList = [2, 5, 10, 20, 50]

const userList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await get('/api/contactUs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response?.data || [])
      } catch (error) {
        console.error('Failed to fetch users:', error?.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const columns = [
    {
      id: '1',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: '2',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: '3',
      header: 'Phone Number',
      accessorKey: 'phoneNumber',
    },
    {
      id: '4',
      header: 'Subject',
      accessorKey: 'subject',
    },
    {
      id: '5',
      header: 'Message',
      accessorKey: 'message',
    },
  ]

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h4>All Users</h4>
              </CardHeader>
              <CardBody>
                <ReactTable
                  columns={columns}
                  data={users}
                  pageSize={5}
                  rowsPerPageList={sizePerPageList}
                  tableClass="table-striped"
                  showPagination
                  loading={loading}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default userList
