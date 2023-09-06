import React, { useEffect, useState } from "react";
import posthogLogoIcon from "../svg/posthog-logo-icon.svg";
import javascriptLogoIcon from "../svg/javascript-logo-icon.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useInterval } from "react-use";
import ApiService from "services/api.service";
import Account from "types/Account";

export enum EventProvider {
  POSTHOG,
  JAVASCRIPT_SNIPPET,
}

interface EventProviderFixture {
  id: EventProvider;
  name: string;
  icon: string;
  connected?: boolean;
  onClick?: () => void;
}

const EventProviderTab = () => {
  const navigate = useNavigate();

  const [isPosthogSetupped, setIsPosthogSetupped] = useState(false);
  const [isJavascriptSnippetSetupped, setIsJavascriptSnippetSetupped] =
    useState(false);

  const loadData = async () => {
    try {
      const {
        data: { posthogSetupped, javascriptSnippetSetupped },
      } = await ApiService.get<Account>({ url: "/accounts" });

      setIsPosthogSetupped(posthogSetupped);
      setIsJavascriptSnippetSetupped(javascriptSnippetSetupped);
    } catch (e) {
      toast.error("Error while loading data");
    }
  };

  useInterval(loadData, 1000);

  const eventProviderToFixtureMap: Record<EventProvider, EventProviderFixture> =
    {
      [EventProvider.POSTHOG]: {
        id: EventProvider.POSTHOG,
        name: "PostHog",
        icon: posthogLogoIcon,
        connected: isPosthogSetupped,
        onClick: () => navigate("/settings/posthog"),
      },
      [EventProvider.JAVASCRIPT_SNIPPET]: {
        id: EventProvider.JAVASCRIPT_SNIPPET,
        name: "Javascript snippet",
        icon: javascriptLogoIcon,
        connected: isJavascriptSnippetSetupped,
        onClick: () => navigate("/settings/javascript-snippet"),
      },
    };

  const connectedProviders = Object.values(eventProviderToFixtureMap).filter(
    (fixture) => fixture.connected
  );

  const supportedProviders = Object.values(eventProviderToFixtureMap).filter(
    (fixture) => !fixture.connected
  );

  return (
    <div className="p-[20px] flex flex-col gap-[20px]">
      <div className="text-[#4B5563]">
        Description Description Description Description Description Description
        Description Description Description Description Description Description
        Description Description{" "}
        <button className="text-[#111827] font-bold underline">
          Documentation
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#E5E7EB]" />

      {connectedProviders.length > 0 && (
        <>
          <div className="font-inter text-[16px] font-semibold leading-[24px]">
            Connected providers
          </div>

          {connectedProviders.map((fixture, i) => (
            <div
              key={i}
              className="w-full px-[20px] py-[10px] flex items-center justify-between border-[1px] border-[#E5E7EB] rounded-[8px]"
            >
              <div className="flex items-center gap-[10px]">
                <div>
                  <img src={fixture.icon} />
                </div>

                <div className="font-inter text-[16px] font-normal leading-[24px]">
                  {fixture.name}
                </div>
              </div>
              <div className="px-[10px] py-[2px] bg-[#DCFCE7] text-[#14532D] font-inter text-[14px] rounded-[14px]">
                Connected
              </div>
            </div>
          ))}
        </>
      )}

      {connectedProviders.length > 0 && supportedProviders.length > 0 && (
        <div className="w-full h-[1px] bg-[#E5E7EB]" />
      )}

      {supportedProviders.length > 0 && (
        <>
          <div className="font-inter text-[16px] font-semibold leading-[24px]">
            Supported providers
          </div>

          <div className="flex gap-[20px] flex-wrap">
            {supportedProviders.map((fixture, i) => (
              <button
                key={i}
                className="w-[240px] flex gap-[10px] items-center p-[20px] border-[1px] border-[#D1D5DB] rounded-[8px]"
                onClick={fixture.onClick}
              >
                <div>
                  <img src={fixture.icon} />
                </div>

                <div className="font-inter text-[16px] font-normal leading-[24px]">
                  {fixture.name}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventProviderTab;