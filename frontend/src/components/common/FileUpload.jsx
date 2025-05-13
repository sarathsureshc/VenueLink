import { Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onFileChange, accept }) => {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 48, mb: 1, color: 'text.secondary' }} />
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept={accept}
        />
      </Button>
    </Box>
  );
};

export default FileUpload;