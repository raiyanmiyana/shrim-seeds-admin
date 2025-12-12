import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Modal, Button } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import { MdOutlineDeleteForever } from 'react-icons/md'
import ReactTable from '@/components/Table'
import { del, get } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/loader'
import toast from 'react-hot-toast'

const sizePerPageList = [2, 5, 10, 20, 50]

const InfluencerContant = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitBtn, setSubmitBtn] = useState()
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await get('/api/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const transformedData = response?.data?.data.map((item) => ({
          id: item.id,
          isDeleted: item.isDeleted,
          title: item.content?.[0]?.content[0].tagline || '',
          tagline: item.description || '',
          influencerName: item.name || 'Undefined',
        }))

        setUsers(transformedData)
      } catch (error) {
        console.error('Failed to fetch users:', error?.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handelOpenForm = () => {
    navigate('/main-category/details/form')
  }

  const handelOpenFormUpdate = (id) => {
    navigate(`/main-category/details/form/${id}`)
  }

  // 🧩 Show confirmation modal before delete
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedId) return
    const token = localStorage.getItem('token')

    setSubmitBtn(true)

    try {
      await del(`/api/category/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Deleted successfully')
      // Remove from UI instantly
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedId))
    } catch (error) {
      console.error('Failed to delete:', error?.response?.data || error.message)
    } finally {
      setSubmitBtn(false)
      setShowModal(false)
      setSelectedId(null)
    }
  }

  const handleCancelDelete = () => {
    setShowModal(false)
    setSelectedId(null)
  }

  const columns = [
    {
      id: '1',
      header: 'Name',
      accessorKey: 'influencerName',
    },
    {
      id: '2',
      header: 'Description',
      accessorKey: 'tagline',
    },
    {
      id: '3',
      header: 'Action',
      cell: ({ row }) => {
        const { id } = row.original
        return (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FaEdit size={18} style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => handelOpenFormUpdate(id)} />
            <MdOutlineDeleteForever size={20} color="#dc3545" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(id)} />
          </div>
        )
      },
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
                <button className="btn btn-primary" onClick={handelOpenForm}>
                  Add
                </button>
              </CardHeader>
              <CardBody>
                <ReactTable
                  columns={columns}
                  data={users || []}
                  pageSize={5}
                  rowsPerPageList={sizePerPageList}
                  tableClass="table-striped"
                  showPagination
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* 🧾 Confirmation Modal */}
      <Modal show={showModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button disabled={submitBtn} variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default InfluencerContant
