import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Dropdown, Form, Row, Modal, Button } from 'react-bootstrap'
import ReactTable from '@/components/Table'
import { FaEdit } from 'react-icons/fa'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { get, del } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import Loader from '../../../components/Loader/loader'
import toast from 'react-hot-toast'

const sizePerPageList = [2, 5, 10, 20, 50]

const CreatorCount = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loadingDel, setLoadingDel] = useState()
  const [loading, setLoading] = useState(true)
  const [categoryData, setCategoryData] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [selected, setSelected] = useState('Select Option')

  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const token = localStorage.getItem('token')

  const handleSelect = (eventKey) => {
    setCategoryId(eventKey)
    const selectedCategory = categoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelected(selectedCategory.name)
    } else {
      setSelected('All Sub category')
    }
  }

  // ✅ Fetch sub-categories based on selected category
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await get(categoryId ? `/api/category/allSubcategory/${categoryId}` : '/api/subCategory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUsers(response?.data.data || [])
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch subcategories')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [categoryId])

  // ✅ Fetch all main categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get('/api/category', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCategoryData(response?.data.data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error?.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleEdit = (id) => {
    navigate(`/sub-category/details/form/${id}`)
  }

  // ✅ Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowModal(true)
  }

  // ✅ Confirm delete (DELETE API call)
  const handleConfirmDelete = async () => {
    if (!selectedId) return

    setLoadingDel(true)
    try {
      await del(`/api/subCategory/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers((prev) => prev.filter((u) => u.id !== selectedId))
      toast.success('Deleted successfully')
    } catch (error) {
      console.error('Failed to delete:', error?.response?.data || error.message)
      toast.error('Failed to delete item')
    } finally {
      setLoadingDel(false)
      setShowModal(false)
      setSelectedId(null)
    }
  }

  const handleCancelDelete = () => {
    setShowModal(false)
    setSelectedId(null)
  }

  const handleOpenModal = () => {
    navigate('/sub-category/details/form')
  }

  // ✅ Table columns
  const columns = [
    {
      id: '1',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: '2',
      header: 'Description',
      accessorKey: 'description',
    },
    {
      id: '3',
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
              <CardHeader className="d-flex gap-3">
                <button className="btn btn-primary" onClick={handleOpenModal}>
                  Add
                </button>
                <Dropdown onSelect={handleSelect}>
                  <Dropdown.Toggle variant="success">{selected}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="">All Sub category</Dropdown.Item>
                    {categoryData.map((category) => (
                      <Dropdown.Item key={category.id} eventKey={category.id}>
                        {category.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </CardHeader>
              <CardBody>
                <ReactTable columns={columns} data={users} pageSize={5} rowsPerPageList={sizePerPageList} tableClass="table-striped" showPagination />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}

      {/* ✅ Delete Confirmation Modal */}
      <Modal show={showModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this sub-category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button disabled={loadingDel} variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatorCount
