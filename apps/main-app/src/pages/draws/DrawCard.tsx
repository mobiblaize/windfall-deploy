import { Button, Divider, Image, Modal } from "@mantine/core";
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import type { LiveDraw } from "./Draws";
import defaultRaffleImg from "../../utils/helper/defaultImg";

// Simple date formatter
function formatDate(dateString?: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });
}

// Video platform detection and embed URL generation
interface VideoInfo {
  embedUrl: string | null;
  platform: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  canEmbed: boolean;
}

function getVideoInfo(url: string): VideoInfo {
  if (!url) return { embedUrl: null, platform: 'unknown', canEmbed: false };
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // YouTube detection
    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
      let videoId = "";
      
      if (hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1).split('?')[0];
      } else if (hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
        // Handle /embed/ URLs
        if (!videoId && urlObj.pathname.includes('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1].split('?')[0];
        }
      }
      
      if (videoId) {
        return {
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          platform: 'youtube',
          canEmbed: true
        };
      }
    }
    
    // Vimeo detection
    if (hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
      if (videoId) {
        return {
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          platform: 'vimeo',
          canEmbed: true
        };
      }
    }
    
    // Direct video file detection (mp4, webm, etc.)
    const extension = urlObj.pathname.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension || '')) {
      return {
        embedUrl: url,
        platform: 'direct',
        canEmbed: true
      };
    }
    
    // Unknown platform - can't embed
    return {
      embedUrl: null,
      platform: 'unknown',
      canEmbed: false
    };
    
  } catch {
    return { embedUrl: null, platform: 'unknown', canEmbed: false };
  }
}

export default function DrawCard({ draw }: { draw: LiveDraw }) {
  const [modalOpened, setModalOpened] = useState(false);
  const videoInfo = getVideoInfo(draw.video_url);

  const handleWatchVideo = () => {
    if (videoInfo.canEmbed) {
      setModalOpened(true);
    } else if (draw.video_url) {
      // Open in new tab if we can't embed
      window.open(draw.video_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 text-center shadow-sm">
        <Image
          className="!rounded-md h-48 object-cover mb-5"
          src={draw.game?.card_image ?? defaultRaffleImg}
          alt={draw.game?.name}
        />
        <h3 className="text-primary-text font-bold text-2xl mb-2">
          {draw.game?.name}
        </h3>
        <p className="text-gray-700 mb-6">{draw.game?.short_description}</p>

        {/* Raffle Details */}
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-4">
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Draw Winner</p>
            <p className="text-base text-wrap break-all text-primary-red font-semibold">
              {draw.customer ? `${draw.customer?.firstname} ${draw.customer?.lastname}`: 'N/A'}
            </p>
          </div>

          <Divider orientation="vertical" />
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Draw Date</p>
            <p className="text-base text-wrap break-all text-[#2d2d2d]">
              {formatDate(draw.draw_at)}
            </p>
          </div>

          <Divider orientation="vertical" />
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Total Ticket</p>
            <p className="text-base text-wrap break-all text-[#2d2d2d]">
              {draw.metrics?.total_tickets_sold?.toLocaleString()}
            </p>
          </div>
        </div>
        <Divider />
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-5">
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Conducted by</p>
            <p className="text-base text-wrap break-all text-[#2d2d2d]">
              {draw.conducted_by?.name ?? 'N/A'}
            </p>
          </div>

          <Divider orientation="vertical" />
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Number of Players</p>
            <p className="text-base text-wrap break-all text-[#2d2d2d]">
              {draw.metrics?.unique_players?.toLocaleString()}
            </p>
          </div>

          <Divider orientation="vertical" />
          <div className="text-center flex-1 gap-1">
            <p className="text-secondary-text">Number of Winners</p>
            <p className="text-base text-wrap break-all text-[#2d2d2d]">
              {draw.metrics?.potential_winner?.toLocaleString()}
            </p>
          </div>
        </div>

        <Button
          my="lg"
          fullWidth
          disabled={!draw.video_url}
          rightSection={
            <GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
          }
          onClick={handleWatchVideo}
          className={
            "!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide !text-lg disabled:opacity-50 disabled:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:bg-gray-200 data-[disabled=true]:border-gray-300 data-[disabled=true]:text-gray-500"
          }
        >
          Watch Live Draw
        </Button>
      </div>

      {/* Video Modal - Only for embeddable videos */}
      {videoInfo.canEmbed && (
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          size="xl"
          centered
          padding={0}
          withCloseButton={false}
          classNames={{
            body: "!p-0",
            content: "!rounded-xl !overflow-hidden",
          }}
        >
          <div className="bg-white rounded-xl text-center">
            {/* Close Button */}
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => setModalOpened(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose size={28} />
              </button>
            </div>

            {/* Video Container */}
            <div className="px-5 pb-3">
              <div className="relative w-full rounded-md overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
                {videoInfo.platform === 'direct' ? (
                  <video
                    className="absolute top-0 left-0 w-full h-full"
                    src={videoInfo.embedUrl || ''}
                    controls
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={videoInfo.embedUrl || ''}
                    title={draw.game?.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              
            </div>

            {/* Content */}
            <div className="p-5 pt-3">
              <h3 className="text-primary-text font-bold text-2xl mb-2">
                {draw.game?.name}
              </h3>
              <p className="text-gray-700 mb-6">{draw.game?.short_description}</p>

              {/* Raffle Details */}
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4 mb-4">
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Draw Winner</p>
                  <p className="text-base text-wrap break-all text-primary-red font-semibold">
                    {draw.customer ? `${draw.customer?.firstname} ${draw.customer?.lastname}`: 'N/A'}
                  </p>
                </div>

                <Divider orientation="vertical" />
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Draw Date</p>
                  <p className="text-base text-wrap break-all text-[#2d2d2d]">
                    {formatDate(draw.draw_at)}
                  </p>
                </div>

                <Divider orientation="vertical" />
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Total Ticket</p>
                  <p className="text-base text-wrap break-all text-[#2d2d2d]">
                    {draw.metrics?.total_tickets_sold?.toLocaleString()}
                  </p>
                </div>
              </div>
              <Divider />
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 pt-4">
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Conducted by</p>
                  <p className="text-base text-wrap break-all text-[#2d2d2d]">
                    {draw.conducted_by?.name ?? 'N/A'}
                  </p>
                </div>

                <Divider orientation="vertical" />
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Number of Players</p>
                  <p className="text-base text-wrap break-all text-[#2d2d2d]">
                    {draw.metrics?.unique_players?.toLocaleString()}
                  </p>
                </div>

                <Divider orientation="vertical" />
                <div className="text-center flex-1 gap-1">
                  <p className="text-secondary-text">Number of Winners</p>
                  <p className="text-base text-wrap break-all text-[#2d2d2d]">
                    {draw.metrics?.potential_winner?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}