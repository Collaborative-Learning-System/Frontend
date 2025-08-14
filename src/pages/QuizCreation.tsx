// import {
//   Box,
//   Stack,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Grid,
//   IconButton,
//   InputLabel,
//   FormControl,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Paper,
//   Card,
//   CardContent,
//   Divider,
//   Tooltip,
// } from "@mui/material";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteIcon from "@mui/icons-material/Delete";
// import QuizIcon from "@mui/icons-material/Quiz";
// import React from "react";

// type QuestionType = "multiple" | "single" | "text";

// interface Question {
//   type: QuestionType;
//   question: string;
//   answers: string[];
//   correct: number;
// }

// const questionTypes = [
//   { value: "multiple", label: "Multiple Choice" },
//   { value: "single", label: "Single Choice" },
//   { value: "text", label: "Text Answer" },
// ];

// const hardnessLevels = ["Easy", "Medium", "Hard"];

// const defaultAnswers = ["", "", "", "", ""];

// const QuizCreation = () => {
//   const [questions, setQuestions] = React.useState<Question[]>([]);
//   const [quizInfo, setQuizInfo] = React.useState({
//     title: "",
//     time: "",
//     timeUnit: "minutes",
//     hardness: "",
//   });

//   const handleQuizInfoChange = (field: string, value: any) => {
//     setQuizInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         type: "multiple",
//         question: "",
//         answers: [...defaultAnswers],
//         correct: 0,
//       },
//     ]);
//   };

//   const handleQuestionChange = (idx: number, field: string, value: any) => {
//     setQuestions((prev) =>
//       prev.map((q, i) => {
//         if (i !== idx) return q;
//         if (field === "type") {
//           // Reset answers for type change
//           return {
//             ...q,
//             type: value,
//             answers: value === "text" ? [""] : [...defaultAnswers],
//             correct: 0,
//           };
//         }
//         return { ...q, [field]: value };
//       })
//     );
//   };

//   const handleAnswerChange = (qIdx: number, aIdx: number, value: string) => {
//     setQuestions((prev) =>
//       prev.map((q, i) =>
//         i === qIdx
//           ? {
//               ...q,
//               answers: q.answers.map((ans, j) => (j === aIdx ? value : ans)),
//             }
//           : q
//       )
//     );
//   };

//   const handleCorrectChange = (qIdx: number, value: string) => {
//     setQuestions((prev) =>
//       prev.map((q, i) => (i === qIdx ? { ...q, correct: Number(value) } : q))
//     );
//   };

//   const handleDeleteQuestion = (idx: number) => {
//     setQuestions((prev) => prev.filter((_, i) => i !== idx));
//   };

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         minHeight: "100vh",
//         bgcolor: "background.default",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         py: { xs: 2, sm: 4 },
//         px: { xs: 1, sm: 3 },
//       }}
//     >
//       <Card
//         elevation={4}
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//           mb: 4,
//           borderRadius: 4,
//           overflow: "visible",
//         }}
//       >
//         <CardContent>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               mb: 2,
//               justifyContent: "space-between",
//             }}
//           >
//             <Box sx={{
//               display: "flex",
//               alignItems: "center",
//             }}>
//               <QuizIcon color="primary" sx={{ fontSize: 40 }} />
//               <Typography variant="h4" color="primary">
//                 Create Quiz
//               </Typography>
//             </Box>
//             <Button
//               variant="contained"
//               size="large"
//               sx={{ mt: { xs: 2, sm: 0 } }}
//             >
//               Save Quiz
//             </Button>
//           </Box>
//           <Divider sx={{ mb: 2 }} />
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={8}>
//               <TextField
//                 fullWidth
//                 label="Quiz Title"
//                 value={quizInfo.title}
//                 onChange={(e) => handleQuizInfoChange("title", e.target.value)}
//                 required
//                 sx={{ mb: 2 }}
//               />
//             </Grid>
//             <Grid item xs={6} sm={2}>
//               <TextField
//                 label="Time Limit"
//                 type="number"
//                 value={quizInfo.time}
//                 onChange={(e) => handleQuizInfoChange("time", e.target.value)}
//                 required
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={6} sm={2}>
//               <FormControl fullWidth>
//                 <InputLabel>Unit</InputLabel>
//                 <Select
//                   value={quizInfo.timeUnit}
//                   label="Unit"
//                   onChange={(e) =>
//                     handleQuizInfoChange("timeUnit", e.target.value)
//                   }
//                 >
//                   <MenuItem value="minutes">Minutes</MenuItem>
//                   <MenuItem value="hours">Hours</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={8}>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Typography>Select Hardness:</Typography>
//                 {hardnessLevels.map((level) => (
//                   <Button
//                     key={level}
//                     variant={
//                       quizInfo.hardness === level ? "contained" : "outlined"
//                     }
//                     color={
//                       level === "Easy"
//                         ? "success"
//                         : level === "Medium"
//                         ? "warning"
//                         : "error"
//                     }
//                     onClick={() => handleQuizInfoChange("hardness", level)}
//                   >
//                     {level}
//                   </Button>
//                 ))}
//               </Stack>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       <Box
//         sx={{
//           width: "100%",
//           maxWidth: 800,
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             mb: 2,
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography variant="h6" fontWeight={600}>
//             Questions
//           </Typography>
//           <Button
//             variant="outlined"
//             startIcon={<AddCircleOutlineIcon />}
//             onClick={handleAddQuestion}
//           >
//             Add Question
//           </Button>
//         </Box>
//         <Stack spacing={3}>
//           {questions.map((q, idx) => (
//             <Paper
//               key={idx}
//               elevation={2}
//               sx={{
//                 p: { xs: 2, sm: 3 },
//                 position: "relative",
//                 bgcolor: "#fafafa",
//                 borderRadius: 3,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               }}
//             >
//               <Tooltip title="Delete Question">
//                 <IconButton
//                   sx={{ position: "absolute", top: 8, right: 8 }}
//                   onClick={() => handleDeleteQuestion(idx)}
//                   color="error"
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Tooltip>
//               <Stack spacing={2}>
//                 <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//                   <FormControl fullWidth>
//                     <InputLabel>Question Type</InputLabel>
//                     <Select
//                       value={q.type}
//                       label="Question Type"
//                       onChange={(e) =>
//                         handleQuestionChange(idx, "type", e.target.value)
//                       }
//                     >
//                       {questionTypes.map((type) => (
//                         <MenuItem key={type.value} value={type.value}>
//                           {type.label}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                   <Typography fontWeight={500} color="primary">
//                     Q{idx + 1}
//                   </Typography>
//                 </Box>
//                 <TextField
//                   fullWidth
//                   label="Question"
//                   value={q.question}
//                   onChange={(e) =>
//                     handleQuestionChange(idx, "question", e.target.value)
//                   }
//                   required
//                 />
//                 {(q.type === "multiple" || q.type === "single") && (
//                   <Box>
//                     <Typography fontWeight={500} mb={1}>
//                       Answers
//                     </Typography>
//                     <Grid container spacing={2}>
//                       {q.answers.map((ans: string, aIdx: number) => (
//                         <Grid item xs={12} sm={6} md={4} key={aIdx}>
//                           <TextField
//                             fullWidth
//                             label={`Answer ${aIdx + 1}`}
//                             value={ans}
//                             onChange={(e) =>
//                               handleAnswerChange(idx, aIdx, e.target.value)
//                             }
//                           />
//                         </Grid>
//                       ))}
//                     </Grid>
//                     <Box sx={{ mt: 2 }}>
//                       <Typography fontWeight={500} mb={1}>
//                         Select Correct Answer
//                       </Typography>
//                       <RadioGroup
//                         row
//                         value={String(q.correct)}
//                         onChange={(e) =>
//                           handleCorrectChange(idx, e.target.value)
//                         }
//                       >
//                         {q.answers.map((ans: string, aIdx: number) => (
//                           <FormControlLabel
//                             key={aIdx}
//                             value={String(aIdx)}
//                             control={<Radio />}
//                             label={`Answer ${aIdx + 1}`}
//                           />
//                         ))}
//                       </RadioGroup>
//                     </Box>
//                   </Box>
//                 )}
//                 {q.type === "text" && (
//                   <Box>
//                     <TextField
//                       fullWidth
//                       label="Correct Answer"
//                       value={q.answers[0] || ""}
//                       onChange={(e) =>
//                         handleAnswerChange(idx, 0, e.target.value)
//                       }
//                     />
//                   </Box>
//                 )}
//               </Stack>
//             </Paper>
//           ))}
//         </Stack>
//       </Box>
//     </Box>
//   );
// };

// export default QuizCreation;
