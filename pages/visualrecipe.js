import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useRef } from 'react'
import { FaDownload } from 'react-icons/fa'

export default function VisualRecipe() {
  const [recipeText, setRecipeText] = useState('')
  const [recipeSvg, setRecipeSvg] = useState('')
  const [loading, setLoading] = useState(false)
  const svgRef = useRef(null)
  
  const generateRecipe = async () => {
    setLoading(true)
    const prompt = `Generate a visual recipe SVG for this recipe: "${recipeText}".
    
    Follow this specific layout format:
    - SVG size: width="800" height="1000" with white background
    - Title at the top with recipe name in large font (36px)
    - A short subtitle with brief description in smaller font (18px)
    - "Ingredients" section header
    - Ingredients arranged in a grid (2-3 rows with 4-5 ingredients per row)
      * For each ingredient, leave an empty image tag positioned above the text
      * Format: <image x="X" y="Y" width="100" height="100" /> followed by <text> for the ingredient name
      * Space ingredients evenly
    - "Process" section header
    - Process steps numbered and displayed in a clean list format
    - At the bottom, leave space for a final dish image. Add it as <image> with a placeholder URL
    - Ensure the SVG is clean and well-structured
    - Use a white background and black text for contrast
    - use proper heading hierarchy
    - modern web colors (like #444 for text, #888 for subtitles)
    - spacing balanced
    - font weight + size tuned
    - clean and neutral background
    Only provide the SVG code, starting with <svg> and ending with </svg>.
    Don't include href attributes in image tags - we'll add those later.`
    
    try {
      const res = await fetch(`/api/gpt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'gpt-4o' })
      })
      const data = await res.json()
      // Clean up the response
      const cleanedResponse = data.response.replace(/^```svg\s+|```|<\?xml[\s\S]+?\?>|<!DOCTYPE[\s\S]+?>/g, '')
      
      // Now we need to find ingredients and add image URLs
      // const enhancedSvg = await addIngredientImages(cleanedResponse)
      setRecipeSvg(enhancedSvg)
    } catch (error) {
      console.error("Error generating recipe:", error)
    } finally {
      setLoading(false)
    }
  }

  const addIngredientImages = async (svg) => {
    // First, find all image tags - these are where we'll add our ingredient images
    const imageTagMatches = svg.match(/<image[^>]*>/g) || []
    const textTagMatches = svg.match(/<text[^>]*>([^<]+)<\/text>/g) || []
    
    let updatedSvg = svg
    
    // Extract ingredients from the text tags
    const ingredientTexts = textTagMatches
      .map(match => {
        const content = match.replace(/<text[^>]*>|<\/text>/g, '').trim()
        return {
          text: content,
          isIngredient: !content.includes('Ingredients') && 
                        !content.includes('Process') && 
                        !content.match(/^[A-Z][a-z]+\s[A-Z][a-z]+$/) && // Skip titles
                        !content.match(/^\d+\./) && // Skip numbered steps
                        content.length > 2
        }
      })
      .filter(item => item.isIngredient)
      .map(item => item.text)
    
    // We need to associate each image tag with the closest text tag after it
    // This is a simple implementation - assumes image tags are directly before their text
    let currentImageIndex = 0
    
    // Find the recipe title to extract the dish name
    const titleMatch = textTagMatches.find(tag => 
      tag.includes('font-size="36"') || 
      tag.includes('font-weight="700"') || 
      tag.includes('font-weight="bold"')
    )
    const dishName = titleMatch ? 
      titleMatch.replace(/<text[^>]*>|<\/text>/g, '').trim() : 
      'Recipe'
    
    // Add a final dish image at the bottom if not already present
    if (!updatedSvg.includes('Final Dish') && !updatedSvg.includes('final dish')) {
      // Find a good position for the final dish image
      const svgEnd = '</svg>'
      const finalImageHTML = `
        <!-- Final Dish -->
        <image x="300" y="650" width="200" height="200" href="https://via.placeholder.com/200x200?text=Final+Dish" />
        <text x="290" y="870" font-size="18" font-weight="600" fill="#222">${dishName}</text>
        <text x="270" y="900" font-size="14" fill="#777">final dish</text>
      `
      
      updatedSvg = updatedSvg.replace(svgEnd, finalImageHTML + svgEnd)
    }
    
    // Replace each image tag with an image that includes the href
    for (let i = 0; i < imageTagMatches.length; i++) {
      if (i < ingredientTexts.length) {
        try {
          const imageTag = imageTagMatches[i]
          const ingredient = ingredientTexts[i]
          
          // Clean the ingredient name (remove quantities, etc.)
          const cleanName = ingredient.replace(/^\d+\s*[a-zA-Z]+\s+/, '').trim()
          
          // Find an image for this ingredient
          const imageUrl = await searchIngredientImage(cleanName)
          
          // Replace the placeholder image tag with one that includes the href
          const updatedImageTag = imageTag.replace(/\/?>$/, ` href="${imageUrl}" />`)
          updatedSvg = updatedSvg.replace(imageTag, updatedImageTag)
        } catch (err) {
          console.error(`Failed to find image for ingredient at index ${i}:`, err)
        }
      }
    }
    
    // Try to add a final dish image at the bottom
    try {
      const recipeName = dishName.toLowerCase().replace(/\s+/g, '+')
      const finalDishImageUrl = await searchIngredientImage(recipeName + ' dish prepared')
      
      // Find the final dish image tag if it exists
      const finalDishMatch = updatedSvg.match(/<image[^>]*y="650"[^>]*>/) || 
                             updatedSvg.match(/<image[^>]*y="[6-9][0-9][0-9]"[^>]*>/)
      
      if (finalDishMatch) {
        const finalImageTag = finalDishMatch[0]
        const updatedFinalImageTag = finalImageTag.replace(/href="[^"]*"/, `href="${finalDishImageUrl}"`)
        updatedSvg = updatedSvg.replace(finalImageTag, updatedFinalImageTag)
      }
    } catch (err) {
      console.error("Failed to find final dish image:", err)
    }
    
    return updatedSvg
  }

  const searchIngredientImage = async (ingredient) => {
    // Use a SearX instance or another image search API
    try {
      const searchQuery = ingredient.toLowerCase() + " ingredient top view isolated"
      const res = await fetch(`/api/search-image?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      return data.imageUrl || `https://via.placeholder.com/100x100?text=${encodeURIComponent(ingredient)}`
    } catch (error) {
      console.error("Error searching for image:", error)
      return `https://via.placeholder.com/100x100?text=${encodeURIComponent(ingredient)}`
    }
  }

  const downloadSvg = () => {
    const blob = new Blob([recipeSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recipe.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPNG = async () => {
    if (recipeSvg) {
      const dataUri = `data:image/svg+xml,${encodeURIComponent(recipeSvg)}`
      const img = new Image()
      img.src = dataUri
      await new Promise((resolve) => { img.onload = resolve })

      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 1000
      
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 800, 1000)
      ctx.drawImage(img, 0, 0, 800, 1000)

      const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      const url = URL.createObjectURL(pngBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recipe.png`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Visual Recipe Creator</title>
        <meta name="description" content="Create beautiful visual recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Visual Recipe</h1>
        <p style={{color: '#888', fontSize: '16px', margin: '20px 0', width: '100%', textAlign: 'center'}}>
          Transform your recipes into beautiful visual guides
        </p>

        <div style={{width: '100%', marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Enter Your Recipe</label>
          <textarea
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            placeholder="Enter recipe name and ingredients, e.g.: 
            Palak Paneer

            Ingredients:
            200g spinach
            250g paneer
            2 garlic cloves
            1 onion
            1 tomato

            Steps:
            1. Blanch spinach
            2. Blend into purée
            3. Sauté garlic and onions
            4. Add tomato and spices
            5. Mix in spinach purée and paneer"
            style={{
              width: '100%',
              border: '1px solid #333',
              padding: '10px',
              outline: 'none',
              fontSize: '18px',
              minHeight: '250px',
              fontFamily: 'system-ui, sans-serif'
            }}
          />
        </div>

        <button onClick={generateRecipe} className={styles.button} disabled={loading}>
          {loading ? 'Generating Recipe...' : 'Generate Visual Recipe'}
        </button>

        {recipeSvg && (
          <div style={{marginTop: '20px', width: '100%'}}>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              overflow: 'auto',
              maxWidth: '100%'
            }}>
              <div ref={svgRef} dangerouslySetInnerHTML={{__html: recipeSvg}} />
            </div>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <button onClick={downloadSvg} className={styles.button}>
                <FaDownload style={{marginRight: '8px'}} /> Download SVG
              </button>
              <button onClick={downloadPNG} className={styles.button}>
                <FaDownload style={{marginRight: '8px'}} /> Download PNG
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}