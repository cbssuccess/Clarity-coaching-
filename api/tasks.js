const ACCOUNT_ID = 'b69e5b9b05e41555059546cb28d58806'
const DB_ID = '021bc66e-b4f7-40af-8e18-afa1eae5a4c7'

async function queryD1(sql, params = []) {
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!token) throw new Error('CLOUDFLARE_API_TOKEN not set')

  const r = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  )
  const data = await r.json()
  if (!data.success) throw new Error(data.errors?.[0]?.message || 'D1 error')
  return data.result?.[0]?.results || []
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const { syncId } = req.query
      if (!syncId) return res.status(400).json({ error: 'syncId required' })

      const rows = await queryD1(
        'SELECT tasks_json FROM task_syncs WHERE sync_id = ?',
        [syncId]
      )
      const tasks = rows[0] ? JSON.parse(rows[0].tasks_json) : []
      return res.status(200).json({ tasks })
    }

    if (req.method === 'POST') {
      const { syncId, tasks } = req.body
      if (!syncId || !Array.isArray(tasks)) {
        return res.status(400).json({ error: 'syncId and tasks array required' })
      }

      await queryD1(
        `INSERT INTO task_syncs (sync_id, tasks_json, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(sync_id) DO UPDATE SET
           tasks_json = excluded.tasks_json,
           updated_at = excluded.updated_at`,
        [syncId, JSON.stringify(tasks), Date.now()]
      )
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: err.message })
  }
}
