// add basic analytics that gets data from supabase ->
// the structure is id, created_at, json with a single json value for all analytics
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { event, metadata } = req.body

    try {
      // Get the existing analytics record
      const { data, error } = await supabase
        .from('tools_nishu_dev_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        throw error
      }

      let newData
      if (data && data.length > 0) {
        // Update existing record
        const existingRecord = data[0]
        newData = {
          ...existingRecord.json,
          [event]: (existingRecord.json[event] || 0) + 1,
          [`${event}_last`]: new Date().toISOString(),
          [`${event}_metadata`]: [...(existingRecord.json[`${event}_metadata`] || []), metadata]
        }

        const { error: updateError } = await supabase
          .from('tools_nishu_dev_analytics')
          .update({ json: newData })
          .eq('id', existingRecord.id)

        if (updateError) throw updateError
      } else {
        // Create new record if none exists
        newData = {
          [event]: 1,
          [`${event}_last`]: new Date().toISOString(),
          [`${event}_metadata`]: [metadata]
        }

        const { error: insertError } = await supabase
          .from('tools_nishu_dev_analytics')
          .insert({ json: newData })

        if (insertError) throw insertError
      }

      res.status(200).json({ success: true, data: newData })
    } catch (error) {
      console.error('Error updating analytics:', error)
      res.status(500).json({ success: false, error: 'Failed to update analytics' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
