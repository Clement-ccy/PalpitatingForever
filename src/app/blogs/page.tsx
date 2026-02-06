"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers } from "lucide-react";
import type { NotionPage } from "@/lib/notion/types";
import { fetchNotionPages, fetchNotionBlocks } from "@/lib/notion/client";
import { fetchCommentTotal } from "@/lib/comments/client";
import { resolveBlogTheme } from "@/components/blogs/theme";
import ViewToggle, { type BlogViewMode } from "@/components/blogs/ViewToggle";
import HotPicksBanner from "@/components/blogs/main/HotPicksBanner";
import PostList from "@/components/blogs/main/PostList";
import SidebarWidgets from "@/components/blogs/main/SidebarWidgets";
import TimelineView from "@/components/blogs/timeline/TimelineView";

type BlogItem = NotionPage & { theme: string };

export default function BlogsPage() {
    const [posts, setPosts] = useState<BlogItem[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [wechatQrUrl, setWechatQrUrl] = useState<string>("");
    const [sponsorText, setSponsorText] = useState<string>("");
    const [sponsorLink, setSponsorLink] = useState<string>("");
    const [areaFilter, setAreaFilter] = useState<string>("All");
    const [commentTotal, setCommentTotal] = useState<number>(0);
    const [wordTotal, setWordTotal] = useState<number>(0);
    const [viewMode, setViewMode] = useState<BlogViewMode>("main");

    useEffect(() => {
        let active = true;
        fetchNotionPages().then((pages) => {
            if (!active) return;
            const mapped = pages
                .filter(
                    (post) => post.category === "Blogs" || post.category === "PF-AIGC",
                )
                .map((post) => ({
                    ...post,
                    theme: resolveBlogTheme(post.theme, post.id),
                }))
                .sort((a, b) => (a.date < b.date ? 1 : -1));
            setPosts(mapped);
        });
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        fetchCommentTotal("main").then((total) => {
            if (!active) return;
            setCommentTotal(total);
        });
        setWechatQrUrl("/media/wechat-qr.png");
        setSponsorText("文案与链接");
        setSponsorLink("链接");
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        const blogPosts = posts.filter(
            (post) => post.category === "Blogs" || post.category === "PF-AIGC",
        );
        if (blogPosts.length === 0) {
            setWordTotal(0);
            return () => {
                active = false;
            };
        }
        Promise.all(blogPosts.map((post) => fetchNotionBlocks(post.id))).then(
            (blocksList) => {
                if (!active) return;
                const countWords = (value: unknown): number => {
                    if (!value) return 0;
                    if (typeof value === "string")
                        return value.trim().split(/\s+/).filter(Boolean).length;
                    if (Array.isArray(value))
                        return value.reduce((sum, item) => sum + countWords(item), 0);
                    if (typeof value === "object")
                        return Object.values(value).reduce(
                            (sum, item) => sum + countWords(item),
                            0,
                        );
                    return 0;
                };
                const total = blocksList.reduce(
                    (sum, blocks) => sum + countWords(blocks),
                    0,
                );
                setWordTotal(total);
            },
        );
        return () => {
            active = false;
        };
    }, [posts]);

    const topPosts = useMemo(
        () =>
            [...posts]
                .sort((a, b) => {
                    const rateScore = (b.rate ?? 0) - (a.rate ?? 0);
                    if (rateScore !== 0) return rateScore;
                    return a.date < b.date ? 1 : -1;
                })
                .slice(0, 5),
        [posts],
    );

    const areaOptions = useMemo(() => {
        const areas = Array.from(
            new Set(posts.map((post) => post.area).filter(Boolean)),
        );
        return ["All", ...areas];
    }, [posts]);

    const filteredPosts = useMemo(
        () =>
            areaFilter === "All"
                ? posts
                : posts.filter((post) => post.area === areaFilter),
        [posts, areaFilter],
    );

    const tagCounts = useMemo(() => {
        const counts = new Map<string, number>();
        posts.forEach((post) => {
            post.tags.forEach((tag) => {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            });
        });
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    }, [posts]);

    const siteDays = Math.max(
        1,
        Math.floor((Date.now() - new Date("2024-05-19").getTime()) / 86400000),
    );

    return (
        <div className="min-h-screen pt-32 px-4 pb-32 max-w-7xl mx-auto relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(var(--accent-works-rgb),0.2)] blur-[140px] rounded-full -z-10" />
            <div className="absolute top-1/3 right-1/4 w-md h-112 bg-[rgba(var(--accent-blogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />
            <div className="absolute bottom-10 left-1/3 w-104 h-104 bg-[rgba(var(--accent-mlogs-rgb),0.2)] blur-[140px] rounded-full -z-10" />

            <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-mono text-muted mb-4">
                    <Layers size={14} />
                    <span>THOUGHTS & ARCHIVES</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
                    Blog
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Documenting the process, sharing insights, and building a second
                    brain.
                </p>
            </header>

            <div className="flex items-center justify-between mb-6">
                <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>

            {viewMode === "main" && (
                <div className="flex flex-col gap-10">
                    <HotPicksBanner posts={topPosts} />
                    <div className="flex flex-row gap-10 items-start">
                        <div className="flex-1 min-w-[320px]">
                        <PostList
                            posts={filteredPosts}
                            areaOptions={areaOptions}
                            areaFilter={areaFilter}
                            onAreaChange={setAreaFilter}
                        />
                        </div>
                        <aside className="w-[320px] shrink-0">
                            <SidebarWidgets
                                wechatQrUrl={wechatQrUrl}
                                sponsorText={sponsorText}
                                sponsorLink={sponsorLink}
                                hotPosts={topPosts
                                    .slice(0, 3)
                                    .map((post) => ({ id: post.id, title: post.title }))}
                                tagCounts={tagCounts}
                                stats={{
                                    postCount: posts.length,
                                    siteDays,
                                    wordTotal,
                                    commentTotal,
                                }}
                            />
                        </aside>
                    </div>
                </div>
            )}

            {viewMode === "timeline" && (
                <TimelineView
                    posts={posts}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            )}
        </div>
    );
}
