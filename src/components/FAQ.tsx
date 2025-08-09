'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { ExpandMore, HelpOutline } from '@mui/icons-material'

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          id: 'getting-started-1',
          question: 'How do I create an account on StudySync?',
          answer: 'Creating an account is simple! Click the "Sign Up" button on our homepage, fill in your details including your university email, and verify your email address. You\'ll then be able to set up your profile and start joining study groups.'
        },
        {
          id: 'getting-started-2',
          question: 'Is StudySync free to use?',
          answer: 'Yes! StudySync offers a comprehensive free plan that includes access to study groups, resource sharing, and basic study plans. We also offer premium features for advanced analytics and unlimited storage.'
        },
        {
          id: 'getting-started-3',
          question: 'How do I join a study group?',
          answer: 'You can browse available study groups by subject or search for specific topics. Click on any group that interests you and request to join. Group administrators will review your request and approve it if you meet the criteria.'
        }
      ]
    },
    {
      category: 'Features',
      questions: [
        {
          id: 'features-1',
          question: 'What is the AI-powered study plan feature?',
          answer: 'Our AI analyzes your learning style, goals, and progress to create personalized study schedules. It adapts based on your performance and suggests optimal study times, resources, and review sessions to maximize your learning efficiency.'
        },
        {
          id: 'features-2',
          question: 'Can I collaborate on documents in real-time?',
          answer: 'StudySync supports real-time collaborative editing for notes, study guides, and project documents. Multiple users can edit simultaneously, with changes synced instantly across all devices.'
        },
        {
          id: 'features-3',
          question: 'How does progress tracking work?',
          answer: 'Our platform tracks your study hours, quiz scores, resource usage, and group participation. You\'ll see detailed analytics showing your learning patterns, strengths, and areas for improvement through interactive dashboards.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          id: 'technical-1',
          question: 'What browsers are supported?',
          answer: 'StudySync works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience and latest security features.'
        },
        {
          id: 'technical-2',
          question: 'Can I access StudySync on mobile devices?',
          answer: 'Yes! StudySync is fully responsive and works great on smartphones and tablets. We also have dedicated mobile apps for iOS and Android coming soon.'
        },
        {
          id: 'technical-3',
          question: 'What file types can I upload and share?',
          answer: 'You can upload documents (PDF, DOC, DOCX), presentations (PPT, PPTX), images (JPG, PNG, GIF), and text files. Each file can be up to 50MB, with unlimited storage on premium plans.'
        }
      ]
    },
    {
      category: 'Account & Privacy',
      questions: [
        {
          id: 'privacy-1',
          question: 'How is my data protected?',
          answer: 'We use industry-standard encryption and security measures to protect your data. Your personal information is never shared with third parties without your consent, and you have full control over your privacy settings.'
        },
        {
          id: 'privacy-2',
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time from your profile settings. This will permanently remove all your data, including study groups you created and shared resources.'
        },
        {
          id: 'privacy-3',
          question: 'How do I change my password?',
          answer: 'Go to your profile settings, click on "Account Security," and select "Change Password." You\'ll need to enter your current password and create a new one that meets our security requirements.'
        }
      ]
    }
  ]

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <HelpOutline sx={{ color: '#083c70ff' }} />
          <Typography variant="h5" sx={{ color: '#083c70ff', fontWeight: 'bold' }}>
            Frequently Asked Questions
          </Typography>
        </Box>

        {faqData.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip 
                label={category.category} 
                sx={{ 
                  bgcolor: '#083c70ff', 
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
            
            {category.questions.map((faq) => (
              <Accordion
                key={faq.id}
                expanded={expanded === faq.id}
                onChange={handleChange(faq.id)}
                sx={{ 
                  mb: 1,
                  '&:before': { display: 'none' },
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  '&.Mui-expanded': {
                    margin: '0 0 8px 0'
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#083c70ff' }} />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}

        <Box sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#083c70ff' }}>
            Still have questions?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Can't find what you're looking for? Our support team is here to help!
          </Typography>
          <Typography variant="body2" sx={{ color: '#083c70ff', fontWeight: 'medium' }}>
            Email us at support@studysync.edu or use the contact form above.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
