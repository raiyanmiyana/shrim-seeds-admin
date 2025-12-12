import React, { useEffect, useState } from 'react'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { Button, Col, Dropdown, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { get, put } from '../../../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const BrandsFormById = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [validated, setValidated] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [subCategoryData, setSubCategoryData] = useState([])
  const [isSubDisabled, setIsSubDisabled] = useState(true)
  const [selected, setSelected] = useState('Select Category')
  const [selectedSub, setSelectedSub] = useState('Select Subcategory')
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    category_id: '',
    subCategory_id: '',
    state: '',
    season: '',
    seedName: '',
    month: '',
    details: [''],
    location: '',
    additional_details: '',
  })

  const [originalData, setOriginalData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)

  // ✅ Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    setPreviewImage(URL.createObjectURL(file))
  }

  // ✅ Handle dynamic detail inputs
  const handleDetailChange = (index, value) => {
    const updated = [...formData.details]
    updated[index] = value
    setFormData((prev) => ({ ...prev, details: updated }))
  }

  const handleAddDetail = () => {
    setFormData((prev) => ({ ...prev, details: [...prev.details, ''] }))
  }

  const handleRemoveDetail = (index) => {
    const updated = [...formData.details]
    updated.splice(index, 1)
    setFormData((prev) => ({ ...prev, details: updated }))
  }

  // ✅ Category dropdown
  const handleSelect = (eventKey) => {
    setFormData((prev) => ({ ...prev, category_id: eventKey, subCategory_id: '' }))
    const selectedCategory = categoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelected(selectedCategory.name)
      setIsSubDisabled(false)
    }
  }

  // ✅ Subcategory dropdown
  const handleSelectSub = (eventKey) => {
    setFormData((prev) => ({ ...prev, subCategory_id: eventKey }))
    const selectedCategory = subCategoryData.find((cat) => cat.id === eventKey)
    if (selectedCategory) {
      setSelectedSub(selectedCategory.name)
    }
  }

  // ✅ Fetch data by ID
  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const response = await get(`/api/product/${id}`)
        const data = response?.data?.data || response?.data
        if (!data) return

        console.log('Fetched Product Data:', data)

        const parsedDetails = (() => {
          try {
            const parsed = JSON.parse(data.details)
            return Array.isArray(parsed) ? parsed : [data.details]
          } catch {
            return data.details ? [data.details] : ['']
          }
        })()

        const initial = {
          category_id: data.category_id || '',
          subCategory_id: data.subCategory_id || '',
          season: data.season || '',
          seedName: data.seedName || '',
          details: parsedDetails,
          location: data.location || '',
          additional_details: data.additional_details || '',
        }

        setFormData(initial)
        setOriginalData(initial)

        if (data.category_id) setIsSubDisabled(false)
        if (data.image) setPreviewImage(data.image)
      } catch (error) {
        console.error('Failed to fetch data by ID:', error)
        toast.error('Failed to fetch data.')
      }
    }

    if (id) fetchDataById()
  }, [id])

  // ✅ Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get('/api/category')
        setCategoryData(res?.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // ✅ Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await get(`/api/category/allSubcategory/${formData.category_id}`)
        setSubCategoryData(res?.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch subcategories:', err)
      }
    }
    if (formData.category_id) fetchSubCategories()
  }, [formData.category_id])

  // ✅ Set dropdown names after categories load
  useEffect(() => {
    if (categoryData.length && formData.category_id) {
      const selectedCategory = categoryData.find((cat) => cat.id === formData.category_id)
      if (selectedCategory) setSelected(selectedCategory.name)
    }

    if (subCategoryData.length && formData.subCategory_id) {
      const selectedSubCategory = subCategoryData.find((sub) => sub.id === formData.subCategory_id)
      if (selectedSubCategory) setSelectedSub(selectedSubCategory.name)
    }
  }, [categoryData, subCategoryData, formData.category_id, formData.subCategory_id])

  // ✅ Handle submit (only changed fields)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    if (form.checkValidity() === false || !formData.category_id || !formData.subCategory_id) {
      e.stopPropagation()
      setValidated(true)
      toast.error('Please fill all required fields.')
      return
    }
    setLoading(true)

    try {
      const data = new FormData()

      // Compare formData vs originalData and add only changed fields
      Object.entries(formData).forEach(([key, value]) => {
        const originalValue = originalData[key]

        const isDetailsChanged = key === 'details' && JSON.stringify(value) !== JSON.stringify(originalValue)

        const isChanged = key !== 'details' && value !== originalValue

        if (isChanged || isDetailsChanged) {
          if (key === 'details') {
            data.append('details', JSON.stringify(value))
          } else {
            data.append(key, value)
          }
        }
      })

      // Add image if changed
      if (selectedFile) data.append('img', selectedFile)

      // No changes detected
      if ([...data.keys()].length === 0) {
        toast('No changes detected.')
        return
      }

      const token = localStorage.getItem('token')
      const res = await put(`/api/product/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(res.data.message || 'Updated successfully!')
      navigate('/products/details')
    } catch (err) {
      console.error('Error updating data:', err)
      toast.error(err?.response?.data?.message || 'Update failed!')
    } finally {
      setLoading(false)
    }
  }

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  return (
    <div>
      <ComponentContainerCard title="Edit Product">
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

            {/* Seed Name */}
            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>Seed Name</FormLabel>
                <FormControl type="text" name="seedName" value={formData.seedName} onChange={handleChange} />
              </FormGroup>
            </Col>

            {/* Season */}
            <Col md={3}>
              <FormGroup className="mb-3">
                <FormLabel>Season</FormLabel>
                <FormControl type="text" name="season" value={formData.season} onChange={handleChange} />
              </FormGroup>
            </Col>

            {/* Dynamic Details */}
            <Col md={12}>
              <FormGroup className="mb-3">
                <FormLabel>Details</FormLabel>
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

            {/* HTML Editor */}
            <Col md={6}>
              <FormGroup className="mb-3">
                <FormLabel>Additional Details</FormLabel>
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
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage.startsWith('blob:') ? previewImage : `${apiUrl}/uploads/${previewImage}`}
                      alt="preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>

          <Button disabled={loading} variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </ComponentContainerCard>
    </div>
  )
}

export default BrandsFormById
