import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ComponentContainerCard from '../../../components/ComponentContainerCard'
import { post } from '../../../utils/api'
import toast from 'react-hot-toast'

const InfluencerContantForm = () => {
  const navigate = useNavigate()
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState()

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
  })
  const [thumbnailImg, setThumbnailImg] = useState(null)

  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (setter, setPreview) => (e) => {
    const file = e.target.files[0]
    setter(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidated(true)
    setLoading(true)

    const token = localStorage.getItem('token')
    const form = new FormData()
    form.append('name', formData.name)
    form.append('description', formData.tagline)

    if (thumbnailImg) form.append('img', thumbnailImg)

    try {
      const res = await post('/api/category', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Main category created successfully')
      navigate('/main-category/details')

      setFormData({ name: '', tagline: '' })
      setThumbnailImg(null)
      setValidated(false)
    } catch (err) {
      console.error('Failed to submit:', err)
      toast.error(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <ComponentContainerCard title="Add New Main Category">
        <Form onSubmit={handleSubmit}>
          {/* heading */}
          <Row className="mb-3">
            <Col>
              <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl type="text" name="name" value={formData.name} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <FormLabel>Tagline</FormLabel>
                <FormControl type="text" name="tagline" value={formData.tagline} onChange={handleChange} required />
              </FormGroup>
            </Col>
          </Row>

          {/* File Uploads */}
          <Row className="mb-3">
            <Col col={4}>
              <FormGroup>
                <FormLabel>Main Category Image</FormLabel>
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

export default InfluencerContantForm
