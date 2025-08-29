import {TextField} from "@mui/material";
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
const Question = ({formData,setFormData,questionCount}) => {
    return (
        <>
            <h4>Question : {questionCount}</h4>
            <TextField label="Question Title"
                       name="title"
                       fullWidth type="text" value={formData.title || ''}
                       onChange={(e) => {
                           setFormData({...formData,title: e.target.value});
                       }}
                       required
                       sx={{
                           my: 2,
                           '& .MuiOutlinedInput-root': {
                               '& fieldset': {
                                   borderColor: 'grey',
                               },
                               '&:hover fieldset': {
                                   borderColor: '#274546',
                               },
                               '&.Mui-focused fieldset': {
                                   borderColor: '#274546',
                               },
                           },
                           '& .MuiInputLabel-root': {
                               '&.Mui-focused': {
                                   color: '#274546 !important',
                               },
                           },
                       }}
            />
            <TextField label="Choice 1"
                       name="answer1"
                       fullWidth type="text" value={formData.answers?.[0] || ''}
                       onChange={(e) => {
                           const updatedAnswers =  [...(formData.answers || [])];
                           updatedAnswers[0] = e.target.value;
                           setFormData({...formData, answers: updatedAnswers});
                       }}
                       required
                       sx={{
                           my: 2,
                           '& .MuiOutlinedInput-root': {
                               '& fieldset': {
                                   borderColor: 'grey',
                               },
                               '&:hover fieldset': {
                                   borderColor: '#274546',
                               },
                               '&.Mui-focused fieldset': {
                                   borderColor: '#274546',
                               },
                           },
                           '& .MuiInputLabel-root': {
                               '&.Mui-focused': {
                                   color: '#274546 !important',
                               },
                           },
                       }}
            />
            <TextField label="Choice 2"
                       name="answer2"
                       fullWidth type="text" value={formData.answers?.[1] || ''}
                       onChange={(e) => {
                           const updatedAnswers = [...(formData.answers || [])];
                           updatedAnswers[1] = e.target.value;
                           setFormData({...formData, answers: updatedAnswers});
                       }}
                       required
                       sx={{
                           my: 2,
                           '& .MuiOutlinedInput-root': {
                               '& fieldset': {
                                   borderColor: 'grey',
                               },
                               '&:hover fieldset': {
                                   borderColor: '#274546',
                               },
                               '&.Mui-focused fieldset': {
                                   borderColor: '#274546',
                               },
                           },
                           '& .MuiInputLabel-root': {
                               '&.Mui-focused': {
                                   color: '#274546 !important',
                               },
                           },
                       }}
            />
            <TextField label="Choice 3"
                       name="answer3"
                       fullWidth type="text" value={formData.answers?.[2] || ''}
                       onChange={(e) => {
                           const updatedAnswers =  [...(formData.answers || [])];
                           updatedAnswers[2] = e.target.value;
                           setFormData({...formData, answers: updatedAnswers});
                       }}
                       required
                       sx={{
                           my: 2,
                           '& .MuiOutlinedInput-root': {
                               '& fieldset': {
                                   borderColor: 'grey',
                               },
                               '&:hover fieldset': {
                                   borderColor: '#274546',
                               },
                               '&.Mui-focused fieldset': {
                                   borderColor: '#274546',
                               },
                           },
                           '& .MuiInputLabel-root': {
                               '&.Mui-focused': {
                                   color: '#274546 !important',
                               },
                           },
                       }}
            />
            <TextField label="Choice 4"
                       name="answer4"
                       fullWidth type="text" value={formData.answers?.[3] ||''}
                       onChange={(e) => {
                           const updatedAnswers =  [...(formData.answers || [])];
                           updatedAnswers[3] = e.target.value;
                           setFormData({...formData, answers: updatedAnswers});
                       }}
                       required
                       sx={{
                           my: 2,
                           '& .MuiOutlinedInput-root': {
                               '& fieldset': {
                                   borderColor: 'grey',
                               },
                               '&:hover fieldset': {
                                   borderColor: '#274546',
                               },
                               '&.Mui-focused fieldset': {
                                   borderColor: '#274546',
                               },
                           },
                           '& .MuiInputLabel-root': {
                               '&.Mui-focused': {
                                   color: '#274546 !important',
                               },
                           },
                       }}
            />
            <FormLabel component="legend">Correct Answer</FormLabel>
            <RadioGroup
                aria-label="mcq"
                name="mcq"
                value={formData.indexOfCorrectAnswer || ''}
                onChange={(e) => setFormData({...formData, indexOfCorrectAnswer: e.target.value})}
                sx={{ display: 'flex', flexDirection: 'row' }}
            >
                <FormControlLabel value="0" control={<Radio />} label={formData.answers?.[0] ||"Choice 1"} />
                <FormControlLabel value="1" control={<Radio />} label={formData.answers?.[1] || "Choice 2"} />
                <FormControlLabel value="2" control={<Radio />} label={formData.answers?.[2] || "Choice 3"} />
                <FormControlLabel value="3" control={<Radio />} label={formData.answers?.[3] ||"Choice 4"} />
            </RadioGroup>
        </>
    )
}

export default Question