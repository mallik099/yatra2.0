import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const PrototypeLimitations = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-amber-800 font-semibold mb-2">Prototype Limitations</h3>
          <div className="text-amber-700 text-sm space-y-2">
            <div>
              <strong>Backend Integration:</strong>
              <ul className="ml-4 mt-1 list-disc">
                <li>Simulated data vs real API</li>
                <li>No actual GPS device integration</li>
                <li>Limited database functionality</li>
              </ul>
            </div>
            <div>
              <strong>Real-world Testing:</strong>
              <ul className="ml-4 mt-1 list-disc">
                <li>No live bus data</li>
                <li>Simulated tracking only</li>
                <li>Performance under load untested</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrototypeLimitations;