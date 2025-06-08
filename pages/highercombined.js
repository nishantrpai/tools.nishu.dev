import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { FaFilter, FaHatWizard, FaUndo } from 'react-icons/fa'
import { removeBackground } from '@imgly/background-removal'

export default function HigherCombined() {

  const tools = [
    {
      id: 'filter',
      name: 'Higher Filter',
      icon: FaFilter,
      settings: [
        {
          type: 'color',
          label: 'Color',
          state: 'color',
          default: '#54FF56',
        },
        {
          type: 'checkbox',
          label: 'Reverse filter (apply to lower colors)',
          state: 'reverseFilter',
          default: false,
        },
        {
          type: 'range',
          label: 'Filter Threshold',
          state: 'filterThreshold',
          min: 0,
          max: 255,
        },
        {
          type: 'range',
          label: 'Grainy',
          state: 'grainyThreshold',
          min: 0,
          max: 100,
        },
        {
          type: 'range',
          label: 'Motion Blur',
          state: 'motionBlur',
          min: 0,
          max: 100
        },
        {
          type: 'range',
          label: 'Opacity Layer',
          state: 'opacityLayer',
          min: 0,
          max: 100
        }
      ],
      apply: (image) => {
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null
        }
        // apply filter function
        if (!image) return;
        const reverseFilter = document.querySelector('#reverseFilter')?.checked;
        // const greenIntensity = parseInt(document.querySelector('#greenIntensity')?.value || 0, 10);
        const filterThreshold = parseInt(document.querySelector('#filterThreshold')?.value || 0, 10);
        const grainyThreshold = parseInt(document.querySelector('#grainyThreshold')?.value || 0, 10);
        const motionBlur = parseInt(document.querySelector('#motionBlur')?.value || 0, 10);
        const color = document.querySelector('#color')?.value || '#000000'
        const opacityLayer = parseInt(document.querySelector('#opacityLayer')?.value || 0, 10);
        const filterColor = hexToRgb(color)

        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        context.clearRect(0, 0, canvas.width, canvas.height)
        // Draw a black rectangle as background
        context.fillStyle = 'black'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, image.width, image.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            if ((reverseFilter && avg <= filterThreshold) || (!reverseFilter && avg > filterThreshold)) {
              data[i] = filterColor.r  // Red channel
              data[i + 1] = filterColor.g // Green channel
              data[i + 2] = filterColor.b  // Blue channel
              data[i + 3] = data[i + 3] * (avg / 255) // Alpha channel
            }
          }
        }
        context.putImageData(imageData, 0, 0)
        if (grainyThreshold !== 0) {
          for (let i = 0; i < data.length; i += 4) {
            const grain = Math.random() * grainyThreshold
            data[i] += grain
            data[i + 1] += grain
            data[i + 2] += grain
          }
          context.putImageData(imageData, 0, 0)
        }

        if (motionBlur !== 0) {
          const steps = 100
          const alpha = 1 / steps
          context.save()
          for (let i = 0; i < steps; i++) {
            const offset = (i - steps / 2) * (motionBlur / steps)
            context.globalAlpha = alpha
            context.drawImage(canvas, offset, 0, canvas.width, canvas.height)
          }
          context.restore()
        }

        if (opacityLayer !== 0) {
          // draw a rectangle with the 0,0,0 and opacity
          context.fillStyle = `rgba(0,0,0,${opacityLayer / 100})`
          context.fillRect(0, 0, canvas.width, canvas.height)
        }

      }
    },
    {
      id: 'highertags',
      name: 'Higher Tags',
      icon: FaHatWizard,
      settings: [
        {
          type: 'select',
          label: 'Select Font',
          state: 'selectFont',
          options: ['Helvetica', 'Times New Roman', 'Comic Sans', 'Higher TM', 'Arrow', 'Scanner', 'Adidagh'],
        },
        {
          type: 'color',
          label: 'Color',
          state: 'color',
        },
        {
          type: 'checkbox',
          label: 'Foreground',
          state: 'foreground',
          default: false,
        },
        {
          type: 'range',
          label: 'Offset X',
          state: 'offsetX',
          min: -1500,
          max: 1500,
        },
        {
          type: 'range',
          label: 'Offset Y',
          state: 'offsetY',
          min: -1500,
          max: 1500,
        },
        {
          type: 'range',
          label: 'Scale',
          state: 'scale',
          default: 1,
          min: 0,
          max: 10,
          step: 0.01,
        },
        {
          type: 'range',
          label: 'Skew X',
          state: 'skewX',
          min: -360,
          max: 360,
          default: 0,
        },
        {
          type: 'range',
          label: 'Skew Y',
          state: 'skewY',
          min: -360,
          max: 360,
          default: 0,
        },
        {
          type: 'range',
          label: 'Rotate',
          state: 'offsetTheta',
          default: 0,
          min: -360,
          max: 360,
        },
        {
          type: 'range',
          label: 'Drag Gap',
          state: 'dragGap',
          default: 0,
          min: 0,
          max: 5000,
        },
        {
          type: 'range',
          label: 'Drag reps',
          state: 'dragReps',
          default: 0,
          min: 0,
          max: 100,
        },
        {
          type: 'hidden',
          state: 'processedImageUrl',
          default: ''
        },
        {
          type: 'range',
          label: 'Emboss',
          state: 'emboss',
          default: 0,
          min: 0,
          max: 100,
        },
        {
          type: 'range',
          label: 'Opacity',
          state: 'opacity',
          default: 100,
          min: 0,
          max: 100,
        }
      ],
      apply: (image) => {
        // apply hat function
        const offsetX = parseInt(document.querySelector('#offsetX')?.value || 0, 10);
        const offsetY = parseInt(document.querySelector('#offsetY')?.value || 0, 10);
        const scale = parseFloat(document.querySelector('#scale')?.value || 1);
        const offsetTheta = parseInt(document.querySelector('#offsetTheta')?.value || 0, 10);
        const foreground = document.querySelector('#foreground')?.checked;
        const dragGap = parseInt(document.querySelector('#dragGap')?.value || 0, 10);
        const dragReps = parseInt(document.querySelector('#dragReps')?.value || 0, 10);
        const processedImageUrl = document.querySelector('#processedImageUrl')?.value;
        const emboss = parseInt(document.querySelector('#emboss')?.value || 0, 10);
        const opacity = parseInt(document.querySelector('#opacity')?.value || 0, 10);
        const skewX = parseInt(document.querySelector('#skewX')?.value || 0, 10);
        const skewY = parseInt(document.querySelector('#skewY')?.value || 0, 10);
        const skewXRad = (skewX * Math.PI) / 180
        const skewYRad = (skewY * Math.PI) / 180

        if (foreground && !processedImageUrl) {
          if (processedImageUrl !== 'processing') {
            document.querySelector('#processedImageUrl').value = 'processing';
            let loadingDiv = document.createElement('span');
            loadingDiv.id = 'loadingDiv';
            loadingDiv.innerText = 'Processing Foreground, please wait...';
            document.querySelector('#tool-settings').appendChild(loadingDiv);
            // add a status to show that the image is being processed
            removeBg(image.src).then(async (processedImg) => {
              console.log('processedImg', processedImg)
              try {
                const response = await fetch(processedImg);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                document.querySelector('#processedImageUrl').value = blobUrl;
                document.querySelector('#loadingDiv').innerText = 'Processed Foreground';
                setTimeout(() => {
                  document.querySelector('#loadingDiv').remove();
                }, 2000);
              } catch (error) {
                console.error('Error fetching the processed image:', error);
                isProcessing = false;
              }
            });
          }
        }
        const color = document.querySelector('#color')?.value || '#000000'
        document.querySelector('#color').style.backgroundColor = color
        const selectFont = document.querySelector('#selectFont')?.value || 'Helvetica'
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0, image.width, image.height)
        if (image) {
          const hat = new Image()
          hat.onload = () => {
            context.save() // Save the current state
            if (!foreground) {
              context.translate(offsetX, offsetY)
              context.transform(1, Math.tan(skewXRad), Math.tan(skewYRad), 1, 0, 0)
              context.rotate(offsetTheta * Math.PI / 180)
              context.globalAlpha = opacity / 100

              if (dragReps > 0) {
                for (let i = 0; i < dragReps; i++) {
                  if (emboss > 0) {
                    context.filter = `blur(${emboss}px)`
                    context.transform(1, Math.tan(skewXRad), Math.tan(skewYRad), 1, 0, 0)
                    context.rotate(offsetTheta * Math.PI / 180)
                    context.drawImage(hat, offsetX, offsetY + (i * dragGap), hat.width * scale, hat.height * scale)
                    context.filter = 'none'
                  } else {
                    context.drawImage(hat, offsetX, offsetY + (i * dragGap), hat.width * scale, hat.height * scale)
                  }
                }
              } else {
                if (emboss > 0) {
                  context.filter = `blur(${emboss}px)`
                  context.transform(1, Math.tan(skewXRad), Math.tan(skewYRad), 1, 0, 0)
                  context.rotate(offsetTheta * Math.PI / 180)
                  context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
                  context.filter = 'none'
                } else {
                  context.drawImage(hat, offsetX, offsetY, hat.width * scale, hat.height * scale)
                }
              }
            } else {
              if (processedImageUrl != 'processing' && processedImageUrl) {
                let foregroundImg = new Image()
                foregroundImg.onload = () => {
                  context.save() // Save state before any transformations
                  context.globalAlpha = opacity / 100

                  if (dragReps > 0) {
                    for (let i = 0; i < dragReps; i++) {
                      context.save() // Save state for each iteration
                      context.translate(offsetX, offsetY)
                      context.transform(1, Math.tan(skewXRad), Math.tan(skewYRad), 1, 0, 0)
                      context.rotate(offsetTheta * Math.PI / 180)

                      if (emboss > 0) {
                        context.filter = `blur(${emboss}px)`
                        context.drawImage(hat, 0, i * dragGap, hat.width * scale, hat.height * scale)
                        context.filter = 'none'
                      } else {
                        context.drawImage(hat, 0, i * dragGap, hat.width * scale, hat.height * scale)
                      }
                      context.restore() // Restore state after each iteration
                    }
                  } else {
                    context.save() // Save state before single draw
                    context.translate(offsetX, offsetY)
                    context.transform(1, Math.tan(skewXRad), Math.tan(skewYRad), 1, 0, 0)
                    context.rotate(offsetTheta * Math.PI / 180)

                    if (emboss > 0) {
                      context.filter = `blur(${emboss}px)`
                      context.drawImage(hat, 0, 0, hat.width * scale, hat.height * scale)
                      context.filter = 'none'
                    } else {
                      context.drawImage(hat, 0, 0, hat.width * scale, hat.height * scale)
                    }
                    context.restore() // Restore state after drawing
                  }

                  context.restore() // Restore initial state
                  context.drawImage(foregroundImg, 0, 0, canvas.width, canvas.height)
                }
                foregroundImg.src = processedImageUrl
              }

            }
            context.restore() // Restore the context state
            context.globalAlpha = 1
          }
          let svgPath;
          switch (selectFont) {
            case 'Helvetica':
              svgPath = '/higherhelvetica.svg';
              break;
            case 'Times New Roman':
              svgPath = '/higheritalic.svg';
              break;
            case 'Comic Sans':
              svgPath = '/highercomicsans.svg';
              break;
            case 'Higher TM':
              svgPath = '/highertm.svg';
              break;
            case 'Arrow':
              svgPath = '/higherarrow.svg';
              break;
            case 'Scanner':
              svgPath = '/higherscanner.svg';
              break;
            case 'Adidagh':
              svgPath = '/adidagh.svg';
              break;
            default:
              svgPath = '/higherdefault.svg';
          }



          if (['/higherscanner.svg'].includes(svgPath)) {
            hat.src = svgPath;
            return;
          }

          fetch(svgPath)
            .then(response => response.text())
            .then(svgText => {
              const coloredSvg = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);
              const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
              hat.src = URL.createObjectURL(blob);
            });
        }
      }
    },
    // Add more tools here
  ]

  const [image, setImage] = useState(null)
  const [activeTool, setActiveTool] = useState('filter')
  const [history, setHistory] = useState([])

  const removeBg = async (imageSrc) => {
    try {
      const blob = await removeBackground(imageSrc)
      const url = URL.createObjectURL(blob)
      return url
    } catch (error) {
      console.error('Background removal failed:', error)
    }
  }

  const saveHistory = () => {
    const canvas = document.getElementById('canvas')
    const dataURL = canvas.toDataURL()
    setImage(dataURL)
    setHistory(prevHistory => [...prevHistory, dataURL])
  }

  const undo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1]
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const img = new Image()
      img.src = lastState
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0)
        setHistory(prevHistory => prevHistory.slice(0, -1))
      }
    }
  }


  const renderSettings = () => {
    const tool = tools.find(t => t.id === activeTool)
    if (!tool) return null

    return tool.settings.map(setting => {
      switch (setting.type) {
        case 'checkbox':
          return (
            <div key={setting.state} style={{ marginTop: '20px', display: 'flex' }}>
              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center' }} htmlFor={setting.state}>
                <input
                  type="checkbox"
                  id={setting.state}
                  defaultValue={eval(setting.default)}
                  onChange={(e) => { tool.apply(image) }}
                  style={{ marginRight: 10, fontSize: 12 }}
                />
                {setting.label}
              </label>
            </div>
          )
        case 'range':
          return (
            <div key={setting.id} style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ flexBasis: '70%', fontSize: 12 }} htmlFor={setting.state}>{setting.label}: </label>
              <input
                type="range"
                id={setting.state}
                min={setting.min}
                max={setting.max}
                step={setting.step || 1}
                defaultValue={setting.default || 0}
                onChange={(e) => {
                  document.querySelector(`#${setting.state}`).value = e.target.value
                  tool.apply(image)
                }}
              />
            </div>
          )
        case 'select':
          return (
            <div key={setting.id} style={{ marginTop: '20px' }}>
              <label htmlFor={setting.state}>{setting.label}: </label>
              <select
                id={setting.state}
                onChange={(e) => tool.apply(image)}
              >
                {setting.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )
        case 'color':
          return (
            <div key={setting.id} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <label htmlFor={setting.state} style={{ fontSize: 12 }}>{setting.label}: </label>
              <input
                type="color"
                id={setting.state}
                defaultValue={setting.default || '#000000'}
                onChange={(e) => tool.apply(image)}
                style={{
                }}
              />
            </div>
          )
        case 'hidden':
          return (
            <input
              key={setting.id}
              type="hidden"
              id={setting.state}
              defaultValue={setting.default}
            />
          )
        default:
          return null
      }
    })
  }

  useEffect(() => {
    // if canvas is not empty setImage to the canvas
    if (document.getElementById('canvas').toDataURL() !== '') {
      const img = new Image()
      img.src = document.getElementById('canvas').toDataURL()
      setImage(img)
    }
  }, [activeTool])

  useEffect(() => {
    // Handle paste events
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();

          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.getElementById('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const context = canvas.getContext('2d');
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(img, 0, 0);
              setImage(img);
            };
            img.src = event.target.result;
          };

          reader.readAsDataURL(blob);
          break;
        }
      }
    };

    // Add the paste event listener
    window.addEventListener('paste', handlePaste);

    // Clean up
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Higher Combined</title>
        <meta name="description" content="Higher Combined" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ maxWidth: '100%' }}>
        <h1>Higher Combined</h1>
        <h2 className={styles.description}>Apply both higher filter and higher hat on any image</h2>
        <div className={styles.row} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 0, border: '1px solid #333', borderRadius: 10 }}>
          <div style={{ flexBasis: '70%', display: 'flex', flexDirection: 'column', gap: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
            <canvas
              id="canvas"
              width="500"
              height="700"
              style={{ width: '100%', maxWidth: 500, height: 'auto', margin: 'auto' }}
            />
          </div>
          <div style={{ flexBasis: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 20, background: '#101010', padding: 20, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0]
              const reader = new FileReader()
              reader.onload = () => {
                const img = new Image()
                img.onload = () => {
                  console.log('image loaded')
                  setImage(img)
                  let canvas = document.getElementById('canvas')
                  canvas.width = img.width
                  canvas.height = img.height
                  let context = canvas.getContext('2d')
                  context.clearRect(0, 0, canvas.width, canvas.height)
                  let drawimg = new Image()
                  drawimg.onload = () => {
                    console.log('drawing image')
                    context.drawImage(img, 0, 0)
                  }
                  drawimg.src = reader.result
                  // saveHistory()
                }
                img.src = reader.result
              }
              reader.readAsDataURL(file)
            }} />
            <div style={{ display: 'flex', marginBottom: 20, width: '100%', background: '#333', borderRadius: 5, borderWidth: 5, borderColor: '#000' }}>
              {tools.map(tool => (
                <button key={tool.id} style={{
                  flexBasis: `${100 / tools.length}%`,
                  // first one will have top left and bottom left border radius
                  // anything in middle will have no border radius
                  // last one will have top right and bottom right border radius
                  border: 'none',
                  background: activeTool === tool.id ? '#444' : '#333',
                  color: activeTool === tool.id ? '#fff' : '#999',
                  fontSize: 14,
                }} onClick={() => setActiveTool(tool.id)}>
                  {tool.name}
                </button>
              ))}
              {/* <button onClick={undo}>
            <FaUndo /> Undo
          </button> */}
            </div>

            <div id="tool-settings" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {renderSettings()}
            </div>
            <button onClick={() => {
              setImage(null)
              const canvas = document.getElementById('canvas')
              const context = canvas.getContext('2d')
              canvas.width = 500
              canvas.height = 500
              context.clearRect(0, 0, canvas.width, canvas.height)
              setActiveTool('filter')
            }}>Clear</button>
            <button
              id="save"
              onClick={() => {
                if (document.getElementById('canvas').toDataURL() !== '') {
                  const img = new Image()
                  img.src = document.getElementById('canvas').toDataURL()
                  setImage(img)
                }
                document.getElementById('save').innerText = 'Saved...'
                setTimeout(() => {
                  document.getElementById('save').innerText = 'Save'
                }, 2000)
              }}>Save</button>
            <button onClick={() => {
              // Apply filter without selection rectangle
              const canvas = document.getElementById('canvas')
              const tempCanvas = document.createElement('canvas')
              const tempContext = tempCanvas.getContext('2d')
              tempCanvas.width = canvas.width
              tempCanvas.height = canvas.height

              // Draw black background
              tempContext.fillStyle = 'black'
              tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

              // Draw the filtered image on top
              tempContext.drawImage(canvas, 0, 0)

              const a = document.createElement('a')
              a.href = tempCanvas.toDataURL('image/png')
              a.download = 'higher_combined.png'
              a.click()

              // // Reapply filter with selection rectangle
              // applyFilter()
              // if (activeTool === 'hat') {
              //   applyHat()
              // }
            }}>Download</button>
          </div>
        </div>
      </main>
    </>
  )
}