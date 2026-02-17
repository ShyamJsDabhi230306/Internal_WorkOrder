using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IWorkOrderRepository
    {
        Task<WorkOrder> CreateAsync(WorkOrderDto dto);
        Task<bool> UpdateAsync(int id, WorkOrderDto dto);
        Task<bool> DeleteAsync(int id);
        Task<WorkOrder?> GetByIdAsync(int id);

        // Updated to return DTO
        Task<IEnumerable<WorkOrderListDto>> GetAllWithVendorAsync(int userTypeId, int? divisionId, int? vendorId);
        //Task<IEnumerable<WorkOrderListDto>> GetAllAsync();
        Task<bool> AcceptWorkOrderAsync(int id, AcceptWorkOrderDto dto);
        Task<bool> DispatchWorkOrderAsync(int workOrderId, DispatchWorkOrderDto dto);
        Task<bool> DispatchProductAsync(int workOrderId, int productId, DispatchWorkOrderDto dto);
        Task<bool> ReceiveWorkOrderAsync(int id);
        Task<bool> ReceiveProductAsync(int workOrderId, int productId, int qty);
        Task<string> GeneratePreviewWorkOrderNo(int divisionId);



        Task<IEnumerable<WorkOrderListDto>> GetAcceptedWorkOrdersAsync(
    int userTypeId,
    int? divisionId,
    int? vendorId
);

    }



}
