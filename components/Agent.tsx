import { cn } from "@/lib/utils";
import Image from "next/image";

// 1. Define the Enum (Stays the same)
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

// 2. Add the missing TypeScript interface for props so Vercel doesn't crash
interface AgentProps {
  userName: string;
  userId: string;
  type: string;
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus: CallStatus = CallStatus.FINISHED
  const isSpeaking = true;
  const messages = [
    'What is your name?',
    'My Name is John Doe, nice to meet you'
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {/* FIX 1: Changed from !=="ACTIVE" to !== CallStatus.ACTIVE */}
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                /* FIX 2: Changed from !== "CONNECTING" to !== CallStatus.CONNECTING */
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />

            <span className="relative">
              {/* FIX 3: Changed string checks to CallStatus.INACTIVE and CallStatus.FINISHED */}
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;