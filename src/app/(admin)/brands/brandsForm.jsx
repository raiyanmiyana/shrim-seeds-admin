import React, { useEffect, useState } from 'react'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { get, post } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const BrandsForm = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])
  const [isSubDisabled, setIsSubDisabled] = useState(true)
  const [selected, setSelected] = useState('Select Category')
  const [selectedSub, setSelectedSub] = useState('Select Subcategory')

  const [formData, setFormData] = useState({
    category_id: '',
    subCategory_id: '',
    state: null,
    season: '',
    seedName: '',
    month: '',
    details: [''], // ✅ details array (starts with one line)
    location: '',
    additional_details: '',
  })

  const [selectedFile, setSelectedFile] = useState(null)

  // Handle normal text input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file input
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  // ✅ Handle dynamic details change
  const handleDetailChange = (index, value) => {
    const updated = [...formData.details]
    updated[index] = value
    setFormData((prev) => ({
      ...prev,
      details: updated,
    }))
  }

  // ✅ Add new detail line
  const handleAddDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, ''],
    }))
  }

  // ✅ Remove a detail line
  const handleRemoveDetail = (index) => {
    const updated = [...formData.details]
    updated.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      details: updated,
    }))
  }

  // Handle category select
  const handleSelect = (eventKey) => {
    setFormData((prev) => ({
      ...prev,
      category_id: eventKey,
      subCategory_id: '',
    }))
    const selectedCategory = categoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelected(selectedCategory.name)
      setIsSubDisabled(false)
    }
  }

  // Handle subcategory select
  const handleSelectSub = (eventKey) => {
    setFormData((prev) => ({
      ...prev,
      subCategory_id: eventKey,
    }))
    const selectedCategory = subCategoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelectedSub(selectedCategory.name)
    }
  }

  // ✅ Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false || !formData.category_id || !formData.subCategory_id) {
      event.stopPropagation()
      setValidated(true)
      toast.error('Please fill all required fields.')
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      // append normal fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'details') {
          data.append('details', JSON.stringify(value)) // ✅ send as array
        } else {
          data.append(key, value)
        }
      })
      if (selectedFile) data.append('img', selectedFile)

      const token = localStorage.getItem('token')
      const res = await post('/api/product', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(res.data.message || 'Data added successfully!')
      navigate('/products/details')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong!')
      console.error('Error submitting form:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch category data
  useEffect(() => {
    const fetchMainCategory = async () => {
      try {
        const response = await get('/api/category')
        setCategoryData(response?.data?.data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchMainCategory()
  }, [])

  // ✅ Fetch subcategories
  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const response = await get(`/api/category/allSubcategory/${formData.category_id}`)
        setSubCategoryData(response?.data?.data || [])
      } catch (error) {
        console.error('Failed to fetch subcategories:', error)
      }
    }
    if (formData.category_id) fetchSubCategory()
  }, [formData.category_id])

  return (
    <div>
      <ComponentContainerCard title="Add New Seed">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            {/* Category */}
            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>
                  Category<span className="text-danger">*</span>
                </FormLabel>
                <Dropdown onSelect={handleSelect}>
                  <Dropdown.Toggle variant="success">{selected}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categoryData.map((cat) => (
                      <Dropdown.Item key={cat.id} eventKey={cat.id}>
                        {cat.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </FormGroup>
            </Col>

            {/* Subcategory */}
            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>
                  Subcategory<span className="text-danger">*</span>
                </FormLabel>
                <Dropdown onSelect={handleSelectSub}>
                  <Dropdown.Toggle variant="success" disabled={isSubDisabled}>
                    {selectedSub}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {subCategoryData.map((cat) => (
                      <Dropdown.Item key={cat.id} eventKey={cat.id}>
                        {cat.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>Seed Name</FormLabel>
                <FormControl type="text" name="seedName" value={formData.seedName} onChange={handleChange} />
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>Season</FormLabel>
                <FormControl type="text" name="season" value={formData.season} onChange={handleChange} />
              </FormGroup>
            </Col>

            {/* ✅ Dynamic Details */}
            <Col md={12}>
              <FormGroup className="mb-3">
                <FormLabel>Details (Add multiple lines)</FormLabel>
                {formData.details.map((detail, index) => (
                  <Row key={index} className="align-items-center mb-2">
                    <Col md={10}>
                      <FormControl
                        type="text"
                        value={detail}
                        onChange={(e) => handleDetailChange(index, e.target.value)}
                        placeholder={`Detail ${index + 1}`}
                      />
                    </Col>
                    <Col md={2}>
                      <Button variant="danger" onClick={() => handleRemoveDetail(index)} disabled={formData.details.length === 1}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" onClick={handleAddDetail}>
                  + Add More
                </Button>
              </FormGroup>
            </Col>

            {/* ✅ React Quill HTML Editor */}
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>Additional Details (HTML Editor)</FormLabel>
                <ReactQuill
                  theme="snow"
                  value={formData.additional_details}
                  onChange={(value) => setFormData((prev) => ({ ...prev, additional_details: value }))}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                  style={{ backgroundColor: '#fff', minHeight: '200px' }}
                />
              </FormGroup>
            </Col>

            {/* Image Upload */}
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>Upload Image</FormLabel>
                <FormControl type="file" accept="image/*" onChange={handleFileChange} />
                {selectedFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                    <div>{selectedFile.name}</div>
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Button disabled={loading} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </ComponentContainerCard>
    </div>
  )
}

export default BrandsForm
