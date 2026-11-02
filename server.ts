import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client on server
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const PROPERTY_KNOWLEDGE_SYSTEM_PROMPT = `You are the Google AI Studio Virtual Concierge for "Tulip Studio at Chic's Beach" (VBZH) located at 4709 Tulip Dr, Virginia Beach, VA 23455.
Host: Yulin Liao (Direct Phone: 757-735-1024, Email: host@tulipstudiovabeach.com).

Property Key Facts:
- Space: Cozy coastal 1-bedroom studio suite (520 sq ft) with 2 plush queen beds with hybrid mattresses and coastal linens. Accommodates up to 4 guests.
- Rate: $98/night base rate, $45 cleaning fee, $22 service fee, 8% tax.
- Reviews: 880+ positive reviews, 4.97-star rating. Superhost Yulin Liao.
- Dedicated Nomad Workspace: Solid wood desk, ergonomic task chair, multi-plug power strip with USB ports, desk lamp, and blazing fast fiber Wi-Fi clocking at 460 Mbps (tested, low-latency, perfect for 4K video calls and remote sprints).
- Full Kitchen: Refrigerator/freezer, 4-burner electric range, full-sized oven, microwave, Keurig coffee station with pods, cookware, knife block, toaster, plates, bowls, and glassware.
- Bathroom: Walk-in glass shower with classic white subway tile, modern matte black fixtures, plush cotton bath sheets, hair dryer, shampoo, conditioner, and body wash.
- Living Area: Brown leather loveseat, clothing garment rack, coastal decor, wall-mounted 50" 4K Smart TV with streaming apps.
- Beach Distance: Exactly 5 minutes walking distance (approx. 0.3 miles) to Chic's Beach (Chesapeake Beach). Quiet shoreline on the Chesapeake Bay with calm waters, dolphin sightings, stunning sunset views, and soft sand.
- Check-in: 3:00 PM via keyless digital touchpad (private 4-digit PIN sent on arrival morning).
- Check-out: 11:00 AM.
- Parking: Free reserved parking spot in the paved driveway directly in front of the studio.
- Heating & Cooling: Split ductless mini-split HVAC with remote control for custom climate.
- House Rules: No smoking indoors. Quiet hours 10 PM - 8 AM. Pets welcome with prior notice.

Local Dining & Highlights:
- Green Flash Cafe (2 min walk): artisan breakfast sandwiches, cold brew, smoothies.
- Commonwealth Brewing Co (4 min drive / 15 min walk): premier craft brewery housed in a restored firehouse, wood-fired pizza, outdoor beer garden.
- Buoy 44 Seafood Grill (5 min walk): waterfront dining right on the Chesapeake Bay with sunset deck, fresh oysters, and crab cakes.
- Zia Marie (3 min drive): cozy Italian trattoria loved by locals.
- Pleasure House Point Natural Area (5 min drive): 118-acre preserve with walking trails, marsh birdwatching, and kayak launches on the Lynnhaven River.
- First Landing State Park (8-10 min drive): scenic maritime forest trails and bay beaches.
- Virginia Beach Oceanfront Boardwalk: 15-20 min drive for the classic 3-mile boardwalk, statue of King Neptune, and ocean surf.

Instructions:
1. Provide warm, hospitable, and concise answers.
2. If asked about booking or prices, mention the $98/night base rate and that they can check dates and reserve directly in the app.
3. If asked for host contact, provide host Yulin Liao at (757) 735-1024.
4. Structure recommendations with neat bullet points.`;

// Intelligent fallback logic if GEMINI_API_KEY is not yet populated
function generateSmartKnowledgeFallback(prompt: string): string {
  const q = prompt.toLowerCase();

  if (q.includes('wifi') || q.includes('internet') || q.includes('speed') || q.includes('work') || q.includes('zoom') || q.includes('nomad')) {
    return `### High-Speed Nomad Wi-Fi & Workspace\n\n- **Wi-Fi Speed:** Dedicated fiber connection clocking at **460 Mbps download / low-latency upload**.\n- **Workspace:** Solid wood desk, ergonomic task chair, multi-outlet power strip with USB ports, and task lamp.\n- **Video Calls:** Tested and verified for seamless all-day Zoom, Google Meet, and large file transfers.\n- **Reliability:** 100% uptime with battery backup router. Perfect for digital nomads and remote professionals staying at 4709 Tulip Dr!`;
  }

  if (q.includes('beach') || q.includes('walk') || q.includes('distance') || q.includes('ocean') || q.includes('bay') || q.includes('chics')) {
    return `### Chic's Beach Access (5-Minute Walk)\n\n- **Distance:** Only **0.3 miles (a 5-minute stroll)** from 4709 Tulip Dr straight down to the Chesapeake Beach shoreline.\n- **Bay Atmosphere:** Chic's Beach (Chesapeake Beach) features calmer, gentler waters than the Atlantic oceanfront, softer sand, and spectacular sunsets over the Chesapeake Bay.\n- **Beach Gear:** Beach towels and chairs are available in the studio closet for your convenience.\n- **Local Tip:** Sunset at Chic's Beach is renowned for dolphin pods swimming near the shore in the late afternoon!`;
  }

  if (q.includes('bed') || q.includes('sleep') || q.includes('guest') || q.includes('people') || q.includes('capacity')) {
    return `### Sleeping Arrangements & Capacity\n\n- **Beds:** **Two plush Queen beds** with premium hybrid memory-foam/spring mattresses and crisp coastal linens.\n- **Capacity:** Comfortably accommodates up to **4 guests**.\n- **Comfort:** Equipped with extra pillows, breathable quilts, and privacy between sleeping zones. Perfect for families, colleagues, or friend groups!`;
  }

  if (q.includes('kitchen') || q.includes('cook') || q.includes('coffee') || q.includes('fridge') || q.includes('oven')) {
    return `### Fully Equipped Private Kitchen\n\n- **Appliances:** Full refrigerator/freezer, 4-burner electric range, full-size oven, and microwave.\n- **Coffee Station:** Keurig single-serve coffee maker with complimentary starter K-cups, sugar, and creamer.\n- **Cookware & Dining:** Non-stick frying pans, stock pots, chef knife block, cutting boards, toaster, dishware, silverware, wine glasses, and mugs.\n- **Dining:** Dining table seating inside the studio.`;
  }

  if (q.includes('park') || q.includes('car') || q.includes('driveway')) {
    return `### Parking at Tulip Studio\n\n- **Dedicated Spot:** One **free private parking space** located right in the driveway directly in front of the studio suite at 4709 Tulip Dr.\n- **Access:** Easy pull-in and pull-out with clear signage.\n- **Additional Parking:** Quiet residential street parking is also available on Tulip Drive if needed.`;
  }

  if (q.includes('check in') || q.includes('check-in') || q.includes('checkout') || q.includes('check out') || q.includes('key') || q.includes('code') || q.includes('lock')) {
    return `### Check-in & Check-out Details\n\n- **Check-in Time:** 3:00 PM (early check-in upon request if schedule permits).\n- **Keyless Entry:** Self check-in with an electronic smart keypad on the private entrance door. Your personal 4-digit PIN is activated at 3:00 PM on your arrival day.\n- **Check-out Time:** 11:00 AM.\n- **Host Support:** Host Yulin Liao is available via text/phone at **(757) 735-1024** if you need any assistance arriving!`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('brewery') || q.includes('drink') || q.includes('beer')) {
    return `### Host Yulin's Top Local Chic's Beach Dining:\n\n1. **Commonwealth Brewing Company** (4 min drive / 15 min walk): Award-winning craft IPA, sour beers, and artisan wood-fired pizza in a converted firehouse.\n2. **Buoy 44 Seafood Grill** (5 min walk): Casual waterfront deck dining on the Chesapeake Bay with fresh oysters, steamed shrimp, and sunset views.\n3. **Green Flash Cafe** (2 min walk): Your go-to morning spot for espresso, iced lattes, and breakfast sandwiches.\n4. **Zia Marie** (3 min drive): Intimate neighborhood Italian trattoria with handmade pasta and wine pairings.`;
  }

  if (q.includes('price') || q.includes('rate') || q.includes('cost') || q.includes('book') || q.includes('reservation') || q.includes('fee')) {
    return `### Rates & Booking Overview\n\n- **Nightly Rate:** $98 / night flat base rate.\n- **Cleaning Fee:** $45 one-time.\n- **Service Fee:** $22 one-time.\n- **Tax:** 8% Virginia state & local lodging tax.\n- **Instant Booking:** You can pick your dates on the Availability Calendar in this app and click **\"Reserve Tulip Studio\"** to confirm immediately!`;
  }

  if (q.includes('host') || q.includes('contact') || q.includes('yulin') || q.includes('phone') || q.includes('number')) {
    return `### Host Information\n\n- **Host:** **Yulin Liao** (Airbnb Superhost with 880+ positive reviews)\n- **Direct Phone:** **(757) 735-1024** (Call or text anytime)\n- **Email:** host@tulipstudiovabeach.com\n- **Response Time:** Typically responds in under 15 minutes!`;
  }

  return `### Welcome to Tulip Studio at Chic's Beach!\n\nI am your **Google AI Studio Concierge**, ready to help you make the most of your stay at 4709 Tulip Dr in Virginia Beach.\n\nHere is how I can help:\n- **Property Amenities:** 2 queen beds, full kitchen, 460 Mbps nomad workspace, walk-in shower.\n- **Chic's Beach Access:** 5-minute easy walk to the bay waters and beach.\n- **Itinerary Planning:** Custom digital nomad or vacation schedules.\n- **Dining & Drinks:** Best local seafood, craft breweries, and morning cafes.\n- **Host Contact:** Yulin Liao at **(757) 735-1024**.\n\nFeel free to ask any question or ask me to draft a 3-day itinerary!`;
}

// 1. AI Concierge Chat Endpoint
app.post('/api/ai/concierge', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      // Use high-fidelity local knowledge fallback
      const fallback = generateSmartKnowledgeFallback(message);
      return res.json({
        response: fallback,
        source: 'knowledge-base',
        model: 'Google AI Studio (Tulip Knowledge Engine)',
      });
    }

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.text && (turn.role === 'user' || turn.role === 'model')) {
          contents.push({
            role: turn.role,
            parts: [{ text: String(turn.text) }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: PROPERTY_KNOWLEDGE_SYSTEM_PROMPT,
      },
    });

    const outputText = response.text || generateSmartKnowledgeFallback(message);

    return res.json({
      response: outputText,
      source: 'gemini-3.8-flash',
      model: 'Google AI Studio · Gemini 3.8 Flash',
    });
  } catch (error: any) {
    console.error('AI Concierge error:', error);
    const fallback = generateSmartKnowledgeFallback(req.body?.message || '');
    return res.json({
      response: fallback,
      source: 'knowledge-base-fallback',
      model: 'Google AI Studio (Tulip Knowledge Engine)',
      error: error?.message,
    });
  }
});

// 2. Custom Itinerary Generator Endpoint
app.post('/api/ai/itinerary', async (req, res) => {
  try {
    const { tripType = 'nomad', days = 3 } = req.body;
    const ai = getAiClient();

    const prompt = `Create an inspiring, highly realistic ${days}-day itinerary for a guest staying at "Tulip Studio at Chic's Beach" (4709 Tulip Dr, Virginia Beach).
Trip Style: ${tripType === 'nomad' ? 'Digital Nomad Workcation (blending focused 460 Mbps deep work sessions with beach sunsets and craft beer)' : tripType === 'couples' ? 'Romantic Beach & Dining Getaway' : 'Family Coastal Exploration'}.
Include:
- Morning routines (Green Flash Cafe coffee, beach walk)
- Afternoon activities (Pleasure House Point, Commonwealth Brewing, First Landing State Park, or quiet desk work)
- Sunset & dinner plans at Chic's Beach (Buoy 44, Zia Marie)
- Specific highlights of staying at 4709 Tulip Dr with 2 queen beds and full kitchen.
Format with clean day-by-day markdown headings and bullet points.`;

    if (!ai) {
      // Structured fallback
      const sampleItinerary = `### ${days}-Day Chic's Beach & Tulip Studio Itinerary (${tripType.toUpperCase()} Edition)\n\n` +
        `#### Day 1: Arrival, Settling in & Chic's Beach Sunset\n` +
        `- **3:00 PM:** Self check-in with electronic keypad at 4709 Tulip Dr. Drop bags, test the 460 Mbps Wi-Fi, and unpack in the dual queen suite.\n` +
        `- **4:30 PM:** 5-minute stroll down Tulip Dr to Chic's Beach. Catch the golden hour light across the Chesapeake Bay.\n` +
        `- **6:30 PM:** Dinner at **Buoy 44 Seafood Grill** on the water. Fresh oysters and crab dip while watching dolphins swim by.\n` +
        `- **8:30 PM:** Walk back, stream a movie on the 50" 4K Smart TV, and enjoy a restful night in the plush queen bed.\n\n` +
        `#### Day 2: Morning Beach Walk & Local Craft Discovery\n` +
        `- **8:00 AM:** Walk to **Green Flash Cafe** for iced nitro cold brew and a breakfast burrito.\n` +
        `- **9:30 AM - 1:00 PM:** Focus sprint at the solid wood desk using the ergonomic chair and high-speed fiber internet.\n` +
        `- **1:30 PM:** Lunch in the private kitchen using fresh local groceries or takeout from Taste Unlimited.\n` +
        `- **3:30 PM:** Kayaking or nature walk at **Pleasure House Point Natural Area** (5 min away).\n` +
        `- **6:00 PM:** Craft beers and wood-fired pizza at **Commonwealth Brewing Co** in the converted historic firehouse.\n\n` +
        `#### Day 3: Coastal Exploration & Relaxation\n` +
        `- **8:30 AM:** Fresh brewed Keurig coffee in the studio, morning jog along Ocean View Ave.\n` +
        `- **11:00 AM:** Quick 10-minute drive to **First Landing State Park** for the Bald Cypress Trail through maritime forest.\n` +
        `- **2:00 PM:** Afternoon relaxation on the leather loveseat or sunbathing at Chic's Beach.\n` +
        `- **7:00 PM:** Intimate dinner at **Zia Marie** Italian trattoria.\n` +
        `- **10:00 PM:** Peaceful sleep under the quiet ductless mini-split climate control.`;

      return res.json({
        itinerary: sampleItinerary,
        source: 'knowledge-base',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: PROPERTY_KNOWLEDGE_SYSTEM_PROMPT,
      },
    });

    return res.json({
      itinerary: response.text,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Itinerary generator error:', error);
    return res.status(500).json({ error: error?.message });
  }
});

// 3. Host AI Assistant Tools Endpoint
app.post('/api/ai/host-tools', async (req, res) => {
  try {
    const { action, guestName = 'Valued Guest', reviewText = '', customNotes = '' } = req.body;
    const ai = getAiClient();

    let prompt = '';
    if (action === 'welcome_message') {
      prompt = `Draft a personalized, warm Airbnb/direct booking welcome message from host Yulin Liao to guest "${guestName}" who is checking into Tulip Studio at 4709 Tulip Dr, Virginia Beach.
Include:
- 3:00 PM check-in time and electronic keypad PIN reminder
- 460 Mbps Wi-Fi network and password reminder
- 5-minute walk to Chic's Beach
- Host Yulin's direct cell: (757) 735-1024 for anything they need
- Notes: ${customNotes || 'Two queen beds ready with fresh linens'}`;
    } else if (action === 'review_reply') {
      prompt = `Draft a gracious, genuine public response from Superhost Yulin Liao to this guest review:
"${reviewText || 'Had an amazing stay! The workspace was perfect for remote work and the beach is so close.'}"
Highlight host hospitality and invite them back to Tulip Studio anytime!`;
    } else {
      prompt = `Write 3 catchy, high-converting Airbnb listing headlines and a 2-paragraph description for Tulip Studio at 4709 Tulip Dr, Virginia Beach highlighting the 2 queen beds, 5 min walk to Chic's Beach, and 460 Mbps nomad desk.`;
    }

    if (!ai) {
      if (action === 'welcome_message') {
        return res.json({
          result: `Hi ${guestName}! 🌊\n\nWelcome to Tulip Studio at Chic's Beach! We are thrilled to host you at 4709 Tulip Dr.\n\nYour check-in is ready starting at 3:00 PM today. The private digital keypad code on your door will be active. Inside, you will find two plush queen beds, fresh towels, Keurig coffee pods, and our high-speed 460 Mbps Wi-Fi details on the desk.\n\nChic's Beach is just a 5-minute walk down the street! If you need anything at all during your stay, feel free to text or call me directly at (757) 735-1024.\n\nHave a fantastic stay!\nWarmly,\nYulin Liao · Host`,
        });
      } else if (action === 'review_reply') {
        return res.json({
          result: `Thank you so much for the wonderful review! It was an absolute pleasure hosting you at 4709 Tulip Dr. I'm delighted that the high-speed workspace and close proximity to Chic's Beach made your trip so memorable. You are always welcome back at Tulip Studio anytime!\n\nWarm regards,\nYulin Liao`,
        });
      } else {
        return res.json({
          result: `### Top Recommended Headlines:\n1. Cozy Chic's Beach Studio · 2 Queen Beds · 460 Mbps Nomad Desk (5 Min Walk to Bay!)\n2. Coastal Retreat at 4709 Tulip Dr · 5 Min to Beach · Kitchen & Dual Queens\n3. Chic's Beach Haven · Ultra-Fast Fiber Wi-Fi · Dedicated Workspace & Parking\n\n### Featured Description:\nEscape to this bright and coastal studio suite located at 4709 Tulip Dr in beautiful Virginia Beach, just a 5-minute stroll from the gentle shores of Chic's Beach. Featuring two plush queen beds with hybrid mattresses, a private full kitchen, and a walk-in subway tile shower, it's the perfect getaway for remote workers, couples, or small families. Remote professionals will love the dedicated solid-wood desk and blazing 460 Mbps fiber Wi-Fi. Hosted with care by Superhost Yulin Liao with over 880 positive reviews!`,
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: PROPERTY_KNOWLEDGE_SYSTEM_PROMPT,
      },
    });

    return res.json({
      result: response.text,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Host tools error:', error);
    return res.status(500).json({ error: error?.message });
  }
});

// 4. AI Studio Status & Info Endpoint
app.get('/api/ai/info', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'online',
    appName: "Tulip Studio at Chic's Beach",
    propertyAddress: '4709 Tulip Dr, Virginia Beach, VA 23455',
    host: 'Yulin Liao',
    model: hasKey ? 'gemini-3.8-flash' : 'Tulip Knowledge Base Engine',
    hasApiKey: hasKey,
    aistudioProject: '01722496-72f8-4d22-ac8d-35be4a9b0bff',
    provider: 'Google AI Studio',
  });
});

// Vite Middleware in Development or Static Serve in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tulip Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
