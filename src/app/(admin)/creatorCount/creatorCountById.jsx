import React, { useEffect, useState } from 'react'
import { Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { get, put } from '../../../utils/api'
import toast from 'react-hot-toast'

const CreatorCountById = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState()

  const [selected, setSelected] = useState('Select Category')
  const [categoryData, setCategoryData] = useState([])
  const [categoryId, setCategoryId] = useState(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
  })
  const [originalData, setOriginalData] = useState({})
  const [thumbnailImg, setThumbnailImg] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // handle dropdown selection
  const handleSelect = (eventKey) => {
    setCategoryId(eventKey)
    const selectedCategory = categoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) setSelected(selectedCategory.name)
  }

  // handle text input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // handle file input
  const handleFileChange = (setter, setPreview) => (e) => {
    const file = e.target.files[0]
    setter(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  // fetch main category list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get('/api/category')
        setCategoryData(res?.data?.data || [])
      } catch (err) {
        console.error('Category fetch error:', err)
      }
    }
    fetchCategories()
  }, [])

  // fetch existing data by id
  useEffect(() => {
    if (!id) return
    const fetchSubCategory = async () => {
      try {
        const res = await get(`/api/subCategory/${id}`)
        const data = res?.data?.data
        if (data) {
          setFormData({
            name: data.name || '',
            tagline: data.description || '',
          })
          setOriginalData(data) // store original for comparison
          setCategoryId(data.category_id)
          const selectedCategory = categoryData.find((cat) => cat.id === data.category_id)
          if (selectedCategory) setSelected(selectedCategory.name)
          if (data.img) setThumbnailPreview(data.img)
        }
      } catch (err) {
        console.error('Fetch by ID error:', err)
        toast.error('Failed to fetch sub category')
      }
    }
    fetchSubCategory()
  }, [id, categoryData])

  // handle update (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)
    setLoading(true)

    if (!categoryId) {
      toast.error('Please select a main category')
      return
    }

    const token = localStorage.getItem('token')

    // collect only changed fields
    const updatedFields = {}
    if (formData.name !== originalData.name) updatedFields.name = formData.name
    if (formData.tagline !== originalData.description) updatedFields.description = formData.tagline
    if (categoryId !== originalData.category_id) updatedFields.category_id = categoryId
    if (thumbnailImg) updatedFields.img = thumbnailImg

    if (Object.keys(updatedFields).length === 0) {
      toast('No changes detected')
      return
    }

    const form = new FormData()
    Object.entries(updatedFields).forEach(([key, value]) => form.append(key, value))

    try {
      await put(`/api/subCategory/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Sub category updated successfully')
      navigate('/sub-category/details')
    } catch (err) {
      console.error('Update failed:', err)
      toast.error(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  console.log('loading', loading)

  return (
    <div>
      <ComponentContainerCard title="Edit Sub Category">
        <Form onSubmit={handleSubmit}>
          {/* Heading fields */}
          <Row className="mb-3">
            <Col>
              <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl type="text" name="name" value={formData.name} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormControl type="text" name="tagline" value={formData.tagline} onChange={handleChange} required />
              </FormGroup>
            </Col>
          </Row>

          {/* File Upload & Dropdown */}
          <Row className="mb-3">
            <Col>
              <FormGroup>
                <FormLabel>Select Main Category</FormLabel>
                <div className={`border rounded ${!categoryId && validated ? 'border-danger' : ''}`}>
                  <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle variant="success" id="dropdown-category" className="w-100 text-start">
                      {selected}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categoryData.map((category) => (
                        <Dropdown.Item key={category.id} eventKey={category.id}>
                          {category.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                {validated && !categoryId && (
                  <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                    Please select a category
                  </div>
                )}
              </FormGroup>
            </Col>

            <Col>
              <FormGroup>
                <FormLabel>Sub Category Image</FormLabel>
                <FormControl type="file" onChange={handleFileChange(setThumbnailImg, setThumbnailPreview)} />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview.startsWith('blob:') ? thumbnailPreview : `${apiUrl}/uploads/${thumbnailPreview}`}
                      alt="Thumbnail"
                      width={120}
                    />
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Submit Button */}
          <Col xs={12}>
            <Button disabled={loading} variant="primary" type="submit">
              Update Sub Category
            </Button>
          </Col>
        </Form>
      </ComponentContainerCard>
    </div>
  )
}

export default CreatorCountById
