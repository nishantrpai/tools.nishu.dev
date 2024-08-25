// send api request to /analytics with event and metadata

export const analytics = async (event, metadata) => {
  console.log('avoid sending analytics for now')
  // try {
  //   console.log('Sending analytics:', event, metadata)  
  //   const res = await fetch('/api/analytics', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ event, metadata })
  //   })
  //   const data = await res.json()
  //   return data
  // } catch (error) {
  //   console.error('Error sending analytics:', error)
  //   return { success: false, error: 'Failed to send analytics' }
  // }
}
