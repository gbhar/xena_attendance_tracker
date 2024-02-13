import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Grid, Typography, Button, createStyles} from '@material-ui/core'
import {Wallpaper} from '@material-ui/icons'
import {makeStyles} from '@material-ui/core/styles'
import {cls} from '../../utils/classnames'
import {connectWithState} from '../../context/StateContext'

const useStyles = makeStyles(theme =>
  createStyles({
    imageSelection: {
      border: `2px dashed ${theme.palette.primary.main}`,
      height: '300px',
      cursor: 'pointer',
    },
    hover: {
      backgroundColor: theme.palette.grey['200'],
    },
    textContainer: {
      marginBottom: '20px',
    },
    uploadText: {
      margin: 0,
      color: theme.palette.primary.main,
      fontWeight: 'bold',
    },
    fileInput: {
      display: 'none',
    },
    img: {
      width: '100%',
    },
    imageFade: {
      opacity: 0.75,
    },
    imagePointer: {
      cursor: 'pointer',
    },
    imageData: {
      display: 'flex',
      justifyContent: 'center',
    },
    processButton: {
      margin: '12px',
    },
  }),
)

export const ImageSelection = ({state, updateState}) => {
  const {processing, newFile, file, hoverState} = state
  const styles = useStyles()
  const [objectUrl, setObjectUrl] = useState(null)

  useEffect(() => {
    if (file) {
      setObjectUrl(URL.createObjectURL(file))
    }
    return () => {
      URL.revokeObjectURL(objectUrl)
      setObjectUrl(null)
    }
    // eslint-disable-next-line
  }, [file])

  const onClick = () => {
    if (!processing) {
      document.getElementById('file-input').click()
    }
  }

  const onFileSelect = selectedFile => {
    updateState({
      ...state,
      file: selectedFile,
      newFile: true,
      noUserError: false,
      newUser: false,
    })
  }

  const onMouseChange = hover => {
    updateState({
      ...state,
      hoverState: hover,
    })
  }

  const imgClasses = cls({
    [styles.img]: true,
    [styles.imageFade]: hoverState || processing,
    [styles.imagePointer]: hoverState && !processing,
  })

  return (
    <Grid className={styles.root}>
      <Grid container justifyContent="center">
        {objectUrl ? (
          <>
            <img
              src={objectUrl}
              className={imgClasses}
              onClick={onClick}
              alt="student-id"
              onMouseEnter={() => onMouseChange(true)}
              onMouseLeave={() => onMouseChange(false)}
            />
            {newFile && (
              <Button
                variant="contained"
                color="primary"
                className={styles.processButton}
                data-dom-id="process-image-button"
                onClick={() =>
                  updateState({
                    ...state,
                    processing: true,
                  })
                }
                disabled={processing}
              >
                {processing ? 'Processing Image...' : 'Process Image'}
              </Button>
            )}
          </>
        ) : (
          <Grid
            className={`${styles.imageSelection} ${
              hoverState ? styles.hover : ''
            }`}
            onClick={onClick}
            container
            disabled
            direction="column"
            justifyContent="center"
            alignItems="center"
            onMouseEnter={() => onMouseChange(true)}
            onMouseLeave={() => onMouseChange(false)}
          >
            <Grid item className={styles.textContainer}>
              <Typography className={styles.uploadText} variant="h5">
                Upload ID Card
              </Typography>
            </Grid>
            <Grid>
              <Wallpaper fontSize={'large'} color="primary" />
            </Grid>
          </Grid>
        )}
        <input
          type="file"
          name="student_id"
          accept="image/*"
          onChange={e => {
            onFileSelect(e.target.files[0])
          }}
          className={styles.fileInput}
          id="file-input"
        />
      </Grid>
    </Grid>
  )
}

ImageSelection.propTypes = {
  updateState: PropTypes.func.isRequired,
  state: PropTypes.shape({
    processing: PropTypes.bool.isRequired,
    newFile: PropTypes.bool.isRequired,
    hoverState: PropTypes.bool.isRequired,
    file: PropTypes.object,
  }).isRequired,
}

export default connectWithState(ImageSelection)
