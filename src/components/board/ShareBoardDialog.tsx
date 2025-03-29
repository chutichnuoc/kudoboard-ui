import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface ShareBoardDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  boardTitle: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`share-tabpanel-${index}`}
      aria-labelledby={`share-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ShareBoardDialog: React.FC<ShareBoardDialogProps> = ({
  open,
  onClose,
  boardId,
  boardTitle,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I've created a Kudoboard for you: "${boardTitle}". Click the link to view!`);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const boardUrl = `${window.location.origin}/boards/${boardId}`;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(boardUrl);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Kudoboard: ${boardTitle}`);
    const body = encodeURIComponent(`${message}\n\n${boardUrl}`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out this Kudoboard: ${boardTitle}`);
    const url = encodeURIComponent(boardUrl);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title">
          Share Board
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="share tabs">
              <Tab icon={<LinkIcon />} label="Link" id="share-tab-0" aria-controls="share-tabpanel-0" />
              <Tab icon={<EmailIcon />} label="Email" id="share-tab-1" aria-controls="share-tabpanel-1" />
              <Tab icon={<FacebookIcon />} label="Social" id="share-tab-2" aria-controls="share-tabpanel-2" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Copy the link to share your board with others:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={boardUrl}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyLink}
              >
                Copy
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Share your board via email:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Message"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={handleSendEmail}
              disabled={!email}
            >
              Send Email
            </Button>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Share your board on social media:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialShare('facebook')}
              >
                Facebook
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<TwitterIcon />}
                onClick={() => handleSocialShare('twitter')}
              >
                Twitter
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LinkedInIcon />}
                onClick={() => handleSocialShare('linkedin')}
              >
                LinkedIn
              </Button>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareBoardDialog;
