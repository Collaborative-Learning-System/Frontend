'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material'
import { Send, CheckCircle } from '@mui/icons-material'

interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Feature Request',
    'Bug Report',
    'Partnership',
    'Academic Institution',
    'Other'
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (onSubmit) {
        await onSubmit(formData)
      }
      
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircle sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
            Message Sent Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for contacting us. We'll get back to you within 24 hours.
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setIsSubmitted(false)}
            sx={{ color: '#083c70ff', borderColor: '#083c70ff' }}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#083c70ff', fontWeight: 'bold', mb: 3 }}>
          Send us a Message
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              error={!!errors.subject}
              helperText={errors.subject}
              required
            />
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel required>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={6}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            error={!!errors.message}
            helperText={errors.message || `${formData.message.length}/500 characters`}
            inputProps={{ maxLength: 500 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
            sx={{ 
              bgcolor: '#083c70ff', 
              '&:hover': { bgcolor: '#0d47a1' },
              py: 1.5
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
