import { motion } from "framer-motion"

export function SizeGuidePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-4xl font-serif font-bold mb-8 text-center">Size Guide</h1>
                <p className="text-gray-600 mb-12 text-center">
                    Find your perfect fit with our comprehensive size chart.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Size</th>
                                <th className="px-6 py-3">Bust (inches)</th>
                                <th className="px-6 py-3">Waist (inches)</th>
                                <th className="px-6 py-3">Hips (inches)</th>
                                <th className="px-6 py-3">Length (inches)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">S (52)</td>
                                <td className="px-6 py-4">40</td>
                                <td className="px-6 py-4">38</td>
                                <td className="px-6 py-4">42</td>
                                <td className="px-6 py-4">52</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">M (54)</td>
                                <td className="px-6 py-4">42</td>
                                <td className="px-6 py-4">40</td>
                                <td className="px-6 py-4">44</td>
                                <td className="px-6 py-4">54</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">L (56)</td>
                                <td className="px-6 py-4">44</td>
                                <td className="px-6 py-4">42</td>
                                <td className="px-6 py-4">46</td>
                                <td className="px-6 py-4">56</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">XL (58)</td>
                                <td className="px-6 py-4">46</td>
                                <td className="px-6 py-4">44</td>
                                <td className="px-6 py-4">48</td>
                                <td className="px-6 py-4">58</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
