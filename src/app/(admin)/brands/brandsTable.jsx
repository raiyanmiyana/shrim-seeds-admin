import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Modal, Button } from 'react-bootstrap'
import ReactTable from '@/components/Table'
import { FaEdit } from 'react-icons/fa'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { get, del } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/loader'
import toast from 'react-hot-toast'

const sizePerPageList = [2, 5, 10, 20, 50]

const BrandsTable = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitBtn, setSubmitBtn] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const token = localStorage.getItem('token')

  // Fetch product list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await get('/api/product', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response?.data?.data || [])
      } catch (error) {
        console.error('Failed to fetch users:', error?.response?.data || error.message)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleEdit = (id) => {
    navigate(`/brands/form/${id}`)
  }

  // ✅ Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  // ✅ Confirm delete (DELETE API)
  const handleConfirmDelete = async () => {
    if (!selectedId) return
    setSubmitBtn(true)
    try {
      await del(`/api/product/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers((prev) => prev.filter((u) => u.id !== selectedId))
      toast.success('Product deleted successfully')
    } catch (error) {
      console.error('Failed to delete:', error?.response?.data || error.message)
      toast.error('Failed to delete product')
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

  const handleAddNew = () => {
    navigate('/brands/form')
  }

  // ✅ Table columns
  const columns = [
    {
      id: '1',
      header: 'Product Name',
      accessorKey: 'seedName',
    },
    {
      id: '2',
      header: 'Main Category',
      accessorKey: 'categoryName',
    },
    {
      id: '3',
      header: 'Sub Category',
      accessorKey: 'subCategoryName',
    },
    {
      id: '4',
      header: 'Season',
      accessorKey: 'season',
    },
    {
      id: '5',
      header: 'Action',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <FaEdit style={{ cursor: 'pointer', color: '#007bff' }} onClick={() => handleEdit(row.original.id)} />
          <MdOutlineDeleteForever size={20} color="#dc3545" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(row.original.id)} />
        </div>
      ),
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
                <button className="btn btn-primary" onClick={handleAddNew}>
                  Add
                </button>
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

      {/* 🧾 Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
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

export default BrandsTable
