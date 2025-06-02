import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio"

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json()

        if (!url || !url.startsWith("http")) {

            return NextResponse.json({ message: "Invalid URL" }, { status: 400 })
        }

        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" },
            cache: "no-store"
        })

        if (!response.ok) {

            return NextResponse.json({ message: "Failed to fetch site" }, { status: 500 })
        }
        const html = await response.text()

        const $ = cheerio.load(html)
        const bannerBySelector = $("[id*=cookie], [class*=cookie], [id*=consent], [class*=consent]").length > 0
        const bannerByText = $("body").text().toLowerCase().includes("We use cookies")
        const found = bannerBySelector || bannerByText
        return NextResponse.json({ found })
    } catch (error) {

        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}