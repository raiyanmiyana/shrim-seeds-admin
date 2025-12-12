import React, { useEffect, useState } from 'react'
import { Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { get, post } from '../../../utils/api'
import toast from 'react-hot-toast'

const CreatorCountForm = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState()

  const [selected, setSelected] = useState('select')
  const [categoryData, setCategoryData] = useState([])
  const [categoryId, setCategoryId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
  })
  const [thumbnailImg, setThumbnailImg] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // handle dropdown selection
  const handleSelect = (eventKey) => {
    setCategoryId(eventKey)
    const selectedCategory = categoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelected(selectedCategory.name)
    } else {
      setSelected('Select Category')
    }
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
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)
    setLoading(true)

    // validate dropdown
    if (!categoryId) {
      toast.error('Please select a main category')
      return
    }

    const token = localStorage.getItem('token')
    const form = new FormData()
    form.append('name', formData.name)
    form.append('description', formData.tagline)
    form.append('category_id', categoryId)
    if (thumbnailImg) form.append('img', thumbnailImg)

    try {
      await post('/api/subCategory', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Sub category created successfully')
      navigate('/sub-category/details')

      // reset form
      setFormData({ name: '', tagline: '' })
      setThumbnailImg(null)
      setThumbnailPreview(null)
      setCategoryId(null)
      setSelected('select')
      setValidated(false)
    } catch (err) {
      console.error('Failed to submit:', err)
      toast.error(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get('/api/category')
        setCategoryData(response?.data.data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error?.response?.data || error.message)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div>
      <ComponentContainerCard title="Add New Sub Category">
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
                      {selected !== 'select' ? selected : 'Select Category'}
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
                <FormControl type="file" onChange={handleFileChange(setThumbnailImg, setThumbnailPreview)} required />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img src={thumbnailPreview} alt="Thumbnail" width={120} />
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          {/* Submit Button */}
          <Col xs={12}>
            <Button disabled={loading} variant="primary" type="submit">
              Submit Form
            </Button>
          </Col>
        </Form>
      </ComponentContainerCard>
    </div>
  )
}

export default CreatorCountForm
