import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { get, put } from '../../../utils/api'
import toast from 'react-hot-toast'
import Loader from '../../../components/Loader/loader'

const InfluencerContantFormUpdate = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [validated, setValidated] = useState(false)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
  })

  const [initialData, setInitialData] = useState({
    name: '',
    tagline: '',
    img: '',
  })

  const [loading, setLoading] = useState(true)
  const [submitBtn, setSubmitBtn] = useState()
  const [thumbnailImg, setThumbnailImg] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await get(`/api/category/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = response?.data?.data
        setFormData({
          name: data?.name || '',
          tagline: data?.description || '',
        })

        setInitialData({
          name: data?.name || '',
          tagline: data?.description || '',
          img: data?.img || '',
        })
      } catch (error) {
        console.error('Failed to fetch data:', error?.response?.data || error.message)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [id])

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setThumbnailImg(file)
    if (file) setThumbnailPreview(URL.createObjectURL(file))
  }

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)

    const token = localStorage.getItem('token')

    // Prepare only changed fields
    const updatedFields = {}

    if (formData.name !== initialData.name) updatedFields.name = formData.name
    if (formData.tagline !== initialData.tagline) updatedFields.description = formData.tagline
    if (thumbnailImg) updatedFields.img = thumbnailImg

    if (Object.keys(updatedFields).length === 0) {
      toast('No changes detected')
      return
    }

    const form = new FormData()
    Object.entries(updatedFields).forEach(([key, value]) => {
      form.append(key, value)
    })

    setSubmitBtn(true)

    try {
      const response = await put(`/api/category/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success(response?.data?.message || 'Category updated successfully')
      setValidated(false)
      navigate('/main-category/details')
    } catch (err) {
      console.error('Error:', err?.response?.data || err.message)
      toast.error(err?.response?.data?.message || 'Update failed')
    } finally {
      setSubmitBtn(false)
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <ComponentContainerCard title="Update Main Category">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Category Name & Description */}
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

            {/* Image Upload */}
            <Row className="mb-3">
              <Col>
                <FormGroup>
                  <FormLabel>Main Category Image</FormLabel>
                  <FormControl type="file" onChange={handleFileChange} />
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail Preview" width={80} className="mt-2" />
                  ) : (
                    initialData.img && <img src={`${apiUrl}/uploads/${initialData.img}`} alt="Thumbnail" width={80} className="mt-2" />
                  )}
                </FormGroup>
              </Col>
            </Row>

            {/* Submit Button */}
            <Col xs={12}>
              <Button disabled={submitBtn} variant="primary" type="submit">
                Submit Form
              </Button>
            </Col>
          </Form>
        </ComponentContainerCard>
      )}
    </div>
  )
}

export default InfluencerContantFormUpdate
